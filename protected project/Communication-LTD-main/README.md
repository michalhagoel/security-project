# Communication-LTD
![image](https://github.com/dolevtabibi/Communication-LTD/assets/88586308/895c62d6-7fa6-475f-8d5a-cc7ff07872fa)

**Communication-LTD is a fictional communication company website developed to showcase my skills in implementing robust security measures and communication features similar to established companies like AT&T. The project highlights the prevention of SQL attacks, Cross-Site Scripting (XSS) vulnerabilities, and the use of self-signed SSL certification and HTTPS protocols to ensure a secure and private communication experience for users.**

# Features:
  * Comprehensive Communication Services: Communication-LTD offers a comprehensive suite of communication services, designed to facilitate seamless interactions, connections, and information sharing among users.

  * Advanced Security Implementation: The website is fortified with advanced security measures, including the prevention of SQL attacks and Cross-Site Scripting (XSS) vulnerabilities. These safeguards uphold the confidentiality and integrity of user data and interactions.

  * Secure Communication Channels: Communication-LTD exemplifies the use of self-signed SSL certification and HTTPS protocols, guaranteeing encrypted and secure communication channels similar to those employed by reputable communication companies.

# Screenshots:
![image](https://github.com/dolevtabibi/Communication-LTD/assets/88586308/1b4b14be-dbd6-4f62-b581-9e018aa9a6c9)
![image](https://github.com/dolevtabibi/Communication-LTD/assets/88586308/2da4b356-7d81-41c9-b8c7-4a24307f0f70)
![image](https://github.com/dolevtabibi/Communication-LTD/assets/88586308/011fc1cf-5893-4ad4-b05e-43e72623881c)

Getting Started
To explore the communication services, security features, and MySQL database integration of Communication-LTD, follow these steps:

1. Clone the repository: `git clone https://github.com/dolevtabibi/communication-ltd.git`
2. Navigate to the project directory: `cd communication-ltd`
3. Install the necessary dependencies: `npm install`

4. Set Up MySQL Databases and Tables:
   - Make sure you have MySQL installed and running on your system.
   - Create two new databases: `ltd-clients-db` and `ltd-users-db`.
   - Import the SQL schema files provided in the project:
     - For `ltd-clients-db`, import `ltd-clients-db-schema.sql` to set up the `clients` table.
     - For `ltd-users-db`, import `ltd-users-db-schema.sql` to set up the `users` table.

5. Configure Database Connection:
   - In the `config` folder, locate the `db-config.js` file.
   - Update the database configuration with your MySQL credentials, including host, user, password, and database names (`ltd-clients-db` and `ltd-users-db`).

6. Start the development server: `npm start`
7. Access the website in your browser at: `http://localhost`

Please note that this is a simulated communication company website created for educational purposes. Ensure that you have MySQL properly configured and the database schemas and tables set up before running the project.

Technologies Used
HTML5, CSS3, JavaScript
Node.js and Express.js
MySQL Database
Self-Signed SSL Certificate
HTTPS Protocols

Contributions
Contributions to enhance the communication features, security, database integration, or any other aspects of the project are welcome. If you encounter any issues or have suggestions, please submit an issue or pull request.

I hope this version of the README better captures the essence of your communication company website. Feel free to further customize it to accurately represent your project's goals and features.
