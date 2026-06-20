import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginModal() {
  const { user, authChecked, login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 已登入或尚未檢查完畢時不顯示
  if (!authChecked || user) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('請填寫帳號與密碼', 'error');
      return;
    }
    try {
      await login(email, password);
      showToast('登入成功', 'success');
    } catch (e) {
      console.error(e);
      showToast('登入失敗，請確認帳密是否正確', 'error');
    }
  };

  return (
    <div className="modal-overlay open" style={{ zIndex: 2000 }}>
      <div className="modal" style={{ maxWidth: 360 }}>
        <div className="modal-header">
          <div className="modal-title">管理員系統登入</div>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">電子信箱</label>
            <input
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">密碼</label>
            <input
              type="password"
              className="form-control"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin}>
            登入系統
          </button>
        </div>
      </div>
    </div>
  );
}
