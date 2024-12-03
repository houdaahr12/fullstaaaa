import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv"; // Load environment variables

import tasksRouter from './tasks.js';

dotenv.config(); // Load .env file variables

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors({
  origin: 'http://localhost:8080', // URL frontend
  credentials: true,
}));

// Session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,  // Set to true in production
    httpOnly: true, // Prevent client-side access
    maxAge: 3600000, // 1 hour session expiry
  },
}));

app.use('/api', tasksRouter);

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "goalgetter",
});

// DB connection verification
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

// Sign-up route
app.post("/signup", async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ message: "Veuillez remplir tous les champs !" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, surname, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur !" });
      }
      res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite pendant l'enregistrement !" });
  }
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Veuillez fournir un email et un mot de passe !" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la connexion !" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Email incorrect ou utilisateur inexistant !" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect !" });
    }

    // Store user info in session
    req.session.user = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email
    };

    res.status(200).json({ message: `Bienvenue ${user.name} ${user.surname}!` });
  });
});

// Middleware to protect private routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // User is authenticated
  }
  res.status(401).json({ message: "Accès non autorisé. Veuillez vous connecter !" });
}

// Private route
app.get("/private", isAuthenticated, (req, res) => {
  res.json({
    message: `Bienvenue dans l'espace privé, ${req.session.user.name} ${req.session.user.surname}!`,
    user: req.session.user
  });
});

// Check if the user is logged in
app.get('/auth/status', (req, res) => {
  if (req.session.user) {
    return res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    return res.json({ isLoggedIn: false });
  }
});

// Get user data from session
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ userName: req.session.user.name });
  } else {
    res.status(401).json({ message: "Utilisateur non authentifié" });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la déconnexion." });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: "Déconnecté avec succès !" });
  });
});

// Route to handle task creation
app.post('/tasks', (req, res) => {
  const { task_name, category, due_date, due_time, priority } = req.body;
  const status = 'pas commencé'; // Default status (must match ENUM in the database)

  let dueDateTime = null;
  if (due_date && due_time) {
    dueDateTime = `${due_date} ${due_time}`;
  } else if (due_date) {
    dueDateTime = `${due_date} 00:00:00`; // Default time if not provided
  }

  // Check if the due date is in the past
  if (dueDateTime) {
    const currentDate = new Date();
    const dueDate = new Date(dueDateTime);
    if (dueDate < currentDate) {
      return res.status(400).json({ message: "La date d'échéance ne peut pas être dans le passé." });
    }
  }

  // Insert the new task into the database
  const query = `INSERT INTO tasks (task_name, category, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;
  const values = [task_name, category, dueDateTime, priority, status];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting task:", err);
      return res.status(500).json({ message: "Erreur lors de l'insertion de la tâche." });
    }
    res.json({ message: "Tâche insérée avec succès !" });
  });
});

// Update task status route
app.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body; // Expecting the status from the request

  // Ensure that the status is one of the valid statuses, e.g., 'pas commencé', 'en cours', 'terminé'
  const validStatuses = ['pas commencé', 'en cours', 'terminé'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut de la tâche invalide" });
  }

  const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  
  db.query(query, [status, taskId], (err, result) => {
    if (err) {
      console.error('Error updating task status:', err);
      return res.status(500).json({ message: "Erreur lors de la mise à jour du statut de la tâche" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.json({ message: 'Statut de la tâche mis à jour avec succès' });
  });
});


// Start server
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
