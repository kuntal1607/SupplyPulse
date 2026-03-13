Smart Supply Chain Analytics Dashboard
SupplyPulse is a real-time monitoring and demand forecasting platform designed for the Indian industrial supply chain, specifically focused on the Pune manufacturing belt. This project leverages the DataCo Global Supply Chain dataset to provide actionable insights into inventory, delivery risks, and demand prediction.

Tech Stack
Frontend: React.js.
Data Visualization: Recharts (Area, Bar, Pie, and Scatter charts).
Analytics Logic: scikit-learn (Linear Regression for Demand Forecasting).
Styling: Custom CSS-in-JS for a "Cyber-Industrial" UI.

The project utilizes the DataCo Smart Supply Chain dataset, adapted for local industrial contexts:
Records: 50 sample rows for development.
Warehouses: Pune Hub, Delhi Central, Mumbai Dock, Chennai Port, and Bangalore WH.
Categories: Machinery, Electronics, Raw Materials, Chemicals, and Safety.

Key Features
Dashboard: High-level KPIs including Total Revenue, Low Stock Alerts, and Late Delivery rates.
Demand AI: Forecasts future monthly demand using a linear regression model ($380 \times month + 2600$).
Inventory Management: Real-time stock tracking across regional hubs like Pune, Delhi, and Mumbai.
Risk Alerts: Automated ticker and badge system highlighting SKUs below critical safety thresholds.
Category Analytics: Deep-dive into profit margins and delivery performance by product category (Machinery, Electronics, etc.).
