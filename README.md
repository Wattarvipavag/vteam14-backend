# Backend repo for vteam14

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Wattarvipavag/vteam14-backend/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/Wattarvipavag/vteam14-backend/?branch=main)
[![Build Status](https://scrutinizer-ci.com/g/Wattarvipavag/vteam14-backend/badges/build.png?b=main)](https://scrutinizer-ci.com/g/Wattarvipavag/vteam14-backend/build-status/main)

#### **Clone the repository**

```bash
git clone git@github.com:Wattarvipavag/vteam14-backend.git
```

#### **Change directory**

```bash
cd vteam14-backend
```

#### **Install dependencies**

```bash
npm install
```

---

## **Docker environment**

#### **Run the application**

```bash
docker compose up -d
```

or

```bash
docker compose up
```

#### **Stop the application**

```bash
docker compose down
```

#### **If in trouble, try rebuilding with**

```
docker compose build --no-cache
```

Then try running docker compose up, again.

---

## **Local environment**

#### **Run the application**

```bash
npm run dev
```

---

## **Tests**

#### **Run Tests with Jest**

```bash
npm run test
```