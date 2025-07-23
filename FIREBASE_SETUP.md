# 🏀 Firebase Setup สำหรับ Basketball Queue System

## ขั้นตอนการตั้งค่า Firebase

### 1. สร้าง Firebase Project
1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก "Create a project" หรือ "Add project"
3. ตั้งชื่อโปรเจ็ค เช่น "basketball-queue"
4. เลือก Analytics (ไม่จำเป็น)
5. Create project

### 2. Setup Realtime Database
1. ในหน้า Project Overview
2. คลิก "Realtime Database" ในเมนูซ้าย
3. คลิก "Create Database"
4. เลือก location (เช่น Singapore)
5. เลือก "Start in test mode" (เพื่อความง่าย)

### 3. ตั้งค่า Web App
1. คลิกไอคอน "</>" ในหน้า Project Overview
2. ตั้งชื่อแอป เช่น "basketball-queue-web"
3. เลือก "Also set up Firebase Hosting" (optional)
4. Register app

### 4. Copy Configuration
1. หลังจาก register แล้ว จะได้ configuration code
2. Copy ข้อมูลใน `firebaseConfig` object
3. นำไปใส่ในไฟล์ `src/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
};
```

### 5. ตั้งค่า Database Rules (สำหรับ Production)
ในหน้า Realtime Database > Rules:

```json
{
  "rules": {
    "games": {
      ".read": true,
      ".write": true
    }
  }
}
```

**หมายเหตุ:** นี่เป็น rule แบบ public ใช้สำหรับ demo เท่านั้น

### 6. Deploy ด้วย Firebase Hosting (Optional)

```bash
# ติดตั้ง Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init

# เลือก:
# - Hosting
# - Use existing project
# - Public directory: dist
# - Configure as single-page app: Yes
# - Set up automatic builds: No

# Build และ Deploy
npm run build
firebase deploy
```

## การใช้งาน

หลังจาก setup เรียบร้อย:

1. **เจ้าของเกม**: เปิดแอปและสร้างทีม เริ่มเกม
2. **ผู้ดู**: ใช้ URL เดียวกัน จะเห็นข้อมูล real-time
3. **ข้อมูลจะ sync ทันที** เมื่อมีการเปลี่ยนแปลง

## URL Structure

```
https://your-app.web.app/
```

ทุกคนที่เข้า URL นี้จะเห็นข้อมูลเดียวกัน และอัพเดทแบบ real-time!

## Features ที่ได้

✅ Real-time score updates  
✅ Real-time queue management  
✅ Champion tracking  
✅ Multiple viewers support  
✅ No need to refresh  
✅ Works on mobile & desktop  

## Troubleshooting

**ถ้าไม่มีข้อมูล:**
- ตรวจสอบ Firebase config
- เช็ค Network tab ใน DevTools
- ดู Console สำหรับ errors

**ถ้า sync ช้า:**
- ตรวจสอบ internet connection
- Firebase มี latency ประมาณ 100-300ms