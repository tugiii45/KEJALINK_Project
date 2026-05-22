# KejaLink 🏠🇰🇪

## 1. Problem Statement
Managing tenant-landlord relationshipsis often bogged down by fragmented communication, manual rent tracking, delayed maintenance resolutions and dishonest caretakers who might get away with rent. Tenants struggle with a lack of transparency when reporting household issues while landlords face inefficiencies tracking multiple paymentsand maintenance statuses across disjointedmessaging apps.

## 2.Proposed Solution

KejaLink bridges this gap as a modern Property Technology (PropTech) and fintech-integrated platform designed to streamline and humanize property managemenT. By centralizing communication, the platform provides real-time maintenance ticketing, automated rent status tracking, and distinct, secure dashboard experiences tailored specifically to the needs of both tenants and landlords. 



## 3. Technologies Used
The application is engineered using a robust, modern frontend architecture paired with scalable cloud services:
*   *Frontend Framework:* React (Vite)
*   *Routing & Data APIs:* React Router 6.4+ (utilizing data loaders and layout guards)
*   *Global State Management:* Redux Toolkit (RTK)
*   *Backend & Database:* Firebase (Firestore for real-time data persistence)
*   *Authentication:* Firebase Auth
*   *Styling:* Tailwind CSS



## 4. Main Platform Pages
To maintain strict structural clarity, the application's view engine is mapped to dedicated role-based routes:

*   */LOGIN / /REGISTER:* Secure entry points handling role assignment during onboarding.
*   */LANDLORD/DASHBOARD:* A comprehensive overview page for property managers to monitor total rent collections, see active maintenance alerts, and view tenant logs.
*   */TENANT/DASHBOARD:* An intuitive portal for tenants showing current rent payment status, billing history, and active maintenance updates.
*   */MAINTENANCE:* The central ticketing hub where tenants can submit new repair requests and landlords can view, update, and resolve ongoing issues.
*   */PAYMENTS:* A dedicated fintech workflow interface tracking transaction history, payment confirmations, and localized rent tracking logs.



## 5. Contribution to the Project
Contributions are highly encouraged! Please follow these steps to contribute to KejaLink:

1. Open Github and open the repository
```https://github.com/tugiii45/KEJALINK_Project.git```

2. Fork the project using the 'Fork' button at the top right of the repository to create your own copy.

3. Git clone in Git bash.

4. Install dependencies ```npm install```