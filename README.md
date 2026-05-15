# 🛰️ Simulated Battle Units – Prototype

A lightweight web-based prototype for visualizing and analyzing **simulated battlefield activity** using ArcGIS Maps SDK for JS, time-based data, and dynamic event detection.

---

## 🚀 Overview

This prototype demonstrates how time-enabled spatial data can be used to build an **interactive tactical situation display**.

At the heart of the prototype lies the integration of a tactical simulation engine, directly connecting with a publicly available [Rheinmetall tactical core API](https://github.com/Rheinmetall/tacticalapi).  

This component is used to:  
- Propagate unit movement based on defined parameters (e.g., speed, range)
- Simulate interactions using simplified combat attributes (e.g., health, armor)
- Enforce consistent behavioral logic across all entities 

It combines:

- 📍 Time-enabled unit positions  
- ⚔️ Combat event detection (kills, engagements)  
- 🧭 Map-based navigation and interaction  
- 📊 Visual analytics (heatmaps, hotspots)  
- ⏱ Timeline replay using a time slider  

---

## 🧠 Key Concepts

### 🕒 Time-Driven Simulation
All unit positions are driven by a `dtg` (date-time group) field.  
The app uses a **time slider** to explore the simulation timeline and replay events.

---

### ⚔️ Combat Event Detection
The `CombatModel` analyzes changes in the dataset to detect:

- Unit destruction (`is_alive` → 0)
- Engagement intensity (number of attackers)
- Target switching behavior

Events are generated dynamically and displayed in a **live combat log**.

---

### 📜 Combat Log
- Displays latest combat events (last 50 entries)
- Chronologically sorted (newest first)
- Updates dynamically as the timeline changes
- Clickable entries → jump to map location

---

### 🌍 Map Interaction
- Click units → detailed popup with stats and timestamps
- Jump to combat events via the log
- Time slider controls visible state of the battlefield

---

### 🔥 Heatmap Analysis
Two faction-based heatmaps provide situational awareness:

- 🟥 Red → RU unit concentration  
- 🟩 Green → UA unit concentration  

Overlapping areas highlight **high-intensity conflict zones**.

---

## 🧩 Architecture

### Components

| Component        | Description |
|-----------------|------------|
| `FeatureLayer`  | Time-enabled unit data |
| `CombatModel`   | Detects combat events between frames |
| `Event Store`   | Stores all detected events |
| UI (Panel)      | Displays filtered events |
| Heatmap Layers  | Visual density analysis |

---

## ⚙️ Tech Stack

- 🗺️ ArcGIS Maps SDK for JavaScript (Web Components)
- 🧩 Calcite Components (UI)
- 🌐 Vanilla JavaScript (ES Modules)
- 📦 Hosted via GitHub Pages

---

## 🛠️ Features

- ✅ Time-based replay (forward + backward)
- ✅ Real-time combat event detection
- ✅ Interactive combat log panel
- ✅ Unit popups with styled data
- ✅ Dual heatmap visualization (RU vs UA)
- ✅ Click-to-navigate from event log
- ✅ Performance-optimized event rendering

---

## ⚠️ Known Limitations

- Heatmaps can be performance-intensive with large datasets  
- Time handling depends on consistent UTC interpretation  
- Multiple records per unit may require client-side deduplication  

---

## 💡 Future Ideas

- 🎯 Engagement clustering (grouped combat events)
- 📈 Combat intensity scoring
- 🧭 Automatic frontline detection
- 🔍 Query-driven filtering (unit, faction, engagement state)
- 🎬 Full playback controls (play/pause/speed)

---

🌐 [Live Demo](https://esride.github.io/tacweb-battlesim/)