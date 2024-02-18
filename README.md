# System to manage enterprises and users.
application is written in node.js and react


> [!IMPORTANT]
> Details
- users, enterprices, relations table.
- Users can belong to multiple enterprises.
- User has the following attributes: Email, First Name, Last Name, Phone Number.
- Enterprise has the following attributes: Name, Tax ID, Address.

> [!IMPORTANT]
how the tables are connected and briefly explain how it should work?
- The enterprise_id column references the id column in the enterprises table, establishing a link to a specific enterprise.
- The user_id column references the id column in the users table, establishing a link to a specific user.
- The combination of user_id and enterprise_id in the user_enterprise_relations table serves as the primary key, ensuring that each user-enterprise relationship is unique.

Both tables are connected through the user_enterprise_relations table. Schema allows for the management of users and enterprises, with the ability to establish relationships between them. Each user can be associated with one or more enterprises, and each enterprise can have multiple users associated with it. The user_enterprise_relations table facilitates this many-to-many relationship between users and enterprises.

## How to run
- [server](https://github.com/adagora/user-and-enterprise-app-demo/blob/main/server/README.md)
- [client](https://github.com/adagora/user-and-enterprise-app-demo/blob/main/my-app/README.md)
