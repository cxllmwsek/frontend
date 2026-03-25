import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชตอนกดปุ่ม

    try {
      const response = await fetch('https://coffee-backend-api.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ยินดีต้อนรับคุณ ${data.user.name} (${data.user.role})`);
        // ส่งข้อมูลพนักงานที่ Login สำเร็จกลับไปให้หน้าหลัก (main.jsx)
        onLoginSuccess(data.user); 
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '2px solid #E8D5C4', borderRadius: '15px', backgroundColor: '#FFFaf0', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#4A3B32', marginBottom: '20px' }}>🔐 เข้าสู่ระบบพนักงาน</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold', color: '#666' }}>อีเมล (Email):</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', color: '#666' }}>รหัสผ่าน (Password):</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#E67E22', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          เข้าสู่ระบบ
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#888', textAlign: 'center' }}>
        <p>ทดสอบ Login:</p>
        <p>Admin: admin@shop.com / 1234</p>
        <p>Barista: barista@shop.com / 1234</p>
      </div>
    </div>
  );
}

export default Login;