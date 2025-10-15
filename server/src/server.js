const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const settlementRoutes = require('./routes/settlementRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config({ path: path.join(__dirname, 'config/.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


