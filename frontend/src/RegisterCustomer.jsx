import { useState } from 'react';

function RegisterCustomer() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '', // เพิ่มช่องยืนยันรหัสผ่านเพื่อความชัวร์
    phone_number: '',
    address: '',
    birth_date: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันจัดการเมื่อพิมพ์ข้อมูลลงช่องต่างๆ
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันเมื่อกดปุ่ม "สมัครสมาชิก"
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช
    setMessage({ type: '', text: '' });

    // 1. เช็คว่ารหัสผ่าน 2 ช่องตรงกันไหม
    if (formData.password !== formData.confirm_password) {
      setMessage({ type: 'error', text: '❌ รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกันครับ' });
      return;
    }

    // 2. เช็คความแข็งแกร่งของรหัสผ่าน (หน้าบ้านเช็คก่อนเลย จะได้ไว)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setMessage({ type: 'error', text: '❌ รหัสผ่านต้องมี 8 ตัวขึ้นไป และมี พิมพ์เล็ก, พิมพ์ใหญ่, ตัวเลข, อักขระพิเศษ (@$!%*?&)' });
      return;
    }

    setIsLoading(true);

    try {
      // 3. ส่งข้อมูลไปหา API หลังบ้านที่เราเพิ่งเขียนไป
      const response = await fetch('https://coffee-backend-api.onrender.com/api/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number,
          address: formData.address,
          birth_date: formData.birth_date
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ สมัครสมาชิกสำเร็จ! ยินดีต้อนรับครับ 🎉' });
        // ล้างฟอร์มให้ว่างหลังจากสมัครเสร็จ
        setFormData({
          first_name: '', last_name: '', email: '', password: '', confirm_password: '', phone_number: '', address: '', birth_date: ''
        });
      } else {
        setMessage({ type: 'error', text: `❌ ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '40px auto', backgroundColor: '#FFFaf0', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#4A3B32' }}>☕ สมัครสมาชิก (Coffee Member)</h2>
      
      {/* ส่วนแสดงข้อความแจ้งเตือน (สำเร็จ / Error) */}
      {message.text && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '5px', 
          backgroundColor: message.type === 'success' ? '#D4EDDA' : '#F8D7DA',
          color: message.type === 'success' ? '#155724' : '#721C24',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" name="first_name" placeholder="ชื่อจริง *" value={formData.first_name} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="last_name" placeholder="นามสกุล *" value={formData.last_name} onChange={handleChange} required style={inputStyle} />
        </div>

        <input type="email" name="email" placeholder="อีเมล (ใช้เป็นชื่อเข้าสู่ระบบ) *" value={formData.email} onChange={handleChange} required style={inputStyle} />
        <input type="password" name="password" placeholder="รหัสผ่าน *" value={formData.password} onChange={handleChange} required style={inputStyle} />
        <input type="password" name="confirm_password" placeholder="ยืนยันรหัสผ่าน *" value={formData.confirm_password} onChange={handleChange} required style={inputStyle} />
        
        <input type="tel" name="phone_number" placeholder="เบอร์โทรศัพท์" value={formData.phone_number} onChange={handleChange} style={inputStyle} />
        
        <div>
          <label style={{ fontSize: '14px', color: '#666', marginBottom: '5px', display: 'block' }}>วันเกิด (เพื่อรับสิทธิพิเศษ):</label>
          <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} style={inputStyle} />
        </div>

        <textarea name="address" placeholder="ที่อยู่จัดส่ง (ไม่บังคับ)" value={formData.address} onChange={handleChange} rows="3" style={{ ...inputStyle, resize: 'none' }} />

        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#8B5A2B',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: '0.3s'
          }}
        >
          {isLoading ? '⏳ กำลังสมัครสมาชิก...' : '📝 สมัครสมาชิกเลย!'}
        </button>
      </form>
    </div>
  );
}

// สไตล์สำเร็จรูปสำหรับช่อง Input
const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '14px',
  boxSizing: 'border-box'
};

export default RegisterCustomer;