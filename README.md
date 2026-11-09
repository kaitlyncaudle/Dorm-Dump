# Team #2 - Student X

- Kaitlyn Caudle
- Donovan Slack
- Sanyae Gibson
- Cailyn Cook
- Erin Miller
- Rachel Harris

# Dorm Dump – College Student Marketplace

## About Dorm Dump

Dorm Dump is a college student marketplace designed to make buying, selling, and exchanging dorm essentials easier, safer, and more affordable. The application allows verified Alabama A&M University students to connect with one another to purchase or exchange items such as furniture, textbooks, electronics, and other college necessities.

Our goal is to help students save money, reduce campus waste, and provide a convenient platform for students to find what they need.

## Key Features

- **Student Verification:** Students register using their university email and A-number.
- **Item Listings:** Users can post items for sale or exchange with photos, descriptions, and prices.
- **Search and Filters:** Students can browse items by category, price, and condition.
- **Buyer-Seller Messaging:** Students can communicate directly within the application.
- **Secure Transactions:** Supports payment options and campus pickup or delivery arrangements.
- **AI Features:** Smart search, listing suggestions, and recommendations to improve the user experience.

## Prototype Demo

This repository contains the Dorm Dump prototype, demonstrating the application's basic interface and navigation.

The prototype includes multiple screens that allow users to navigate between different sections of the application and return to previous screens. It also demonstrates functional buttons to simulate basic user interactions.

## How to Run the Prototype

Follow the steps below to download and run the Dorm Dump prototype using Visual Studio Code on Windows or macOS.

### Step 1: Download the Project

1. Open the GitHub repository.
2. Click the green **Code** button.
3. Select **Download ZIP**.
4. Extract the downloaded ZIP file.
5. Open **Visual Studio Code**.
6. Select **File → Open Folder** and choose the extracted project folder.

### Step 2: Install Bun

Dorm Dump uses Bun to install dependencies and run the application.

**For macOS:**

1. Open the terminal in VS Code by selecting **Terminal → New Terminal**.
2. Run the following command:

```bash
curl -fsSL https://bun.sh/install | bash
```

3. If Bun is not recognized, run:

```bash
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.zshrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**For Windows:**

1. Open VS Code and select **Terminal → New Terminal**.
2. Make sure the terminal is using **PowerShell**.
3. Run the following command:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

4. Close and reopen the terminal after installation.

**Verify Installation (Windows and macOS):**

Run:

```bash
bun --version
```

If Bun is installed correctly, the terminal will display the installed version number.

### Step 3: Install Dependencies

Make sure the terminal is open in the Dorm Dump project folder.

Run:

```bash
bun install
```

This installs the packages required to run the application.

### Step 4: Run the Application

Start the development server by running:

```bash
bun run dev
```

### Step 5: Open the Website

1. Wait for the terminal to display the local development URL.
2. Open the URL in your browser, typically:

```text
http://localhost:8080
```

3. The Dorm Dump prototype should now be running.

### Step 6: Stop the Application

To stop the application, return to the VS Code terminal and press **Control + C**.

## Project Status

Dorm Dump is currently in the prototype and development stage. Additional features and functionality will be implemented as development progresses.
