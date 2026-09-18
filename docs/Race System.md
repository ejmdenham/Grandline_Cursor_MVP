# GrandLine Race System — Complete Context & Architecture

## Purpose of This Document

This document is written to be read by an AI coding assistant (Cursor) **with zero prior context**. It explains:

* What the GrandLine app does
* How races work conceptually
* How users experience races
* How the frontend, backend, and map interact
* How data flows through the system

No assumptions are made about prior knowledge.

---

## 1. What GrandLine Is (High-Level)

GrandLine is a **real-world, map-based adventure and racing app**.

Users physically move through the real world (walking, biking, etc.) while the app:

* Shows them locations on a map
* Tracks their progress via GPS
* Verifies when they reach required locations
* Compares their progress against other players

A "race" is not a visual animation—it is a **set of real-world locations that must be physically reached**.

---

## 2. Core Concept: Locations, GPS, and Geofences

### What Is a Geofence?

A **geofence** is a virtual circle or shape placed on the map around a real-world coordinate.

* Defined by: latitude, longitude, and radius (meters)
* The app can detect when a user enters this area using GPS

### Why Geofences Are Used

Geofences are used to:

* Verify that a user has *actually reached* a required location
* Prevent users from cheating by manually clicking a button
* Trigger events in the app (e.g., checkpoint completed)

Every important race location (start, checkpoints, finish) is represented by a geofence.

---

## 3. What a Race Is (Fully Defined)

A **race** is a structured activity made up of:

1. A **start area** (geofence)
2. One or more **checkpoints** (geofences)
3. A **finish checkpoint** (final geofence)

To complete a race, a user must physically enter the geofence of each required checkpoint in the correct way.

---

## 4. Two Types of Checkpoint Visibility

### A. All-At-Once Checkpoints (Strategic Mode)

In this mode:

* The user sees **all checkpoints immediately** when the race starts
* All checkpoint locations are shown on the map at the same time
* The user can plan routes and strategies

Use cases:

* Competitive races
* Strategy-focused events

---

### B. Progressive Checkpoint Reveal (Adventure Mode)

In this mode:

* The user only sees **one checkpoint at a time**
* When the user enters the geofence of the current checkpoint:

  * The app confirms completion
  * The backend reveals the **next checkpoint**
* The next checkpoint is unknown until the previous one is completed

This creates:

* Suspense
* Exploration
* Less pre-planning and less cheating

The race explicitly defines which mode it uses.

---

## 5. User Experience: Step-by-Step Race Flow

### Step 1: Discover Races

* The app requests the user's current location
* The backend returns nearby races
* The frontend displays race start areas as shapes on the map

---

### Step 2: View Race Details

* User taps a race
* The app shows:

  * Rules (walking, biking, etc.)
  * Entry fee
  * Start time or availability
  * Whether checkpoints are all-at-once or progressive

---

### Step 3: Join Race

* User confirms participation
* Backend creates a race participation record
* User is now registered for the race

---

### Step 4: Start Race

* At the official start time, the user taps "Start"
* The backend marks the race as active for that user
* The backend returns:

  * Either all checkpoints (all-at-once mode)
  * Or only the first checkpoint (progressive mode)

---

### Step 5: Navigate to Checkpoints

* The app uses GPS to guide the user
* The map shows the active checkpoint(s)
* The app continuously checks whether the user enters a checkpoint geofence

---

### Step 6: Checkpoint Completion

When the user enters a checkpoint geofence:

1. The frontend detects the GPS entry
2. The frontend sends location data to the backend
3. The backend verifies:

   * The checkpoint is correct
   * The GPS location is valid
4. The backend confirms completion
5. If progressive mode:

   * The backend sends the next checkpoint location

---

### Step 7: Finish Race

* When the final checkpoint geofence is entered:

  * Finish time is recorded
  * Rank is calculated
  * Results are shown to the user

---

## 6. Frontend Responsibilities (React Native)

The frontend:

* Displays maps and geofences
* Tracks GPS location
* Detects geofence entry locally
* Sends verified events to the backend
* Manages UI state (joined, active, finished)

The frontend **does not decide race outcomes**.

---

## 7. Backend Responsibilities (AWS)

The backend:

* Stores race definitions
* Stores checkpoint locations
* Verifies checkpoint completion
* Controls which checkpoints are revealed
* Calculates rankings
* Prevents basic cheating

The backend is the **source of truth**.

---

## 8. Backend Architecture (Recommended)

* **Auth:** Amazon Cognito
* **API:** API Gateway + Lambda
* **Database:** DynamoDB
* **Scheduling:** EventBridge
* **Assets:** S3

---

## 9. Core Backend Data Models

### Race

* raceId
* checkpointRevealMode (all-at-once | progressive)
* startZone
* rules
* pricing

### Checkpoint

* raceId
* index
* geofence (lat, lng, radius)
* isFinal

### ParticipantRaceState

* userId
* raceId
* currentCheckpointIndex
* completedCheckpoints
* status (joined | active | finished)
* startTime
* finishTime

---

## 10. Key Design Principle

* The frontend **requests** information
* The backend **decides** what is allowed
* The map **visualizes** backend decisions
* GPS **proves** real-world movement

This separation is critical for scalability and fairness.

---

## 11. MVP Scope Reminder

Initial MVP includes:

* Race discovery
* Joining races
* Progressive checkpoint races
* GPS-based checkpoint verification
* Finish timing and simple leaderboard

Everything else can be layered later.

---

## End of Context Document
