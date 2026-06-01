import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEAM_MEMBERS } from '@/data/index';

// 每位成员的密码（可在 Settings 中修改，存于 localStorage）
const DEFAULT_PASSWORDS: Record<string, string> = {
  '李铧燕': 'virtavo01',
  '王芳':   'virtavo01',
  '张伟':   'virtavo01',
  '陈静':   'virtavo01',
  '刘洋':   'virtavo01',
  '李金彦': 'virtavo01',
};

export default function Login() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) { setError('请选择登录账号'); return; }
    if (!password)    { setError('请输入密码'); return; }
    setLoading(true);
    setError('');

    // 模拟网络延迟
    await new Promise(r => setTimeout(r, 400));

    // 密码校验：先读 localStorage 自定义密码，否则用默认
    const storedPw = localStorage.getItem(`af_pw_${selectedUser}`);
    const correctPw = storedPw || DEFAULT_PASSWORDS[selectedUser] || 'virtavo01';

    if (password === correctPw) {
      const member = TEAM_MEMBERS.find(m => m.name === selectedUser)!;
      localStorage.setItem('af_logged_in', 'true');
      localStorage.setItem('af_user', JSON.stringify(member));
      navigate('/');
    } else {
      setError('密码错误，请重试');
    }
    setLoading(false);
  };

  const selectedMember = TEAM_MEMBERS.find(m => m.name === selectedUser);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0faf9 0%, #e6f4f3 40%, #f7f9fc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"微软雅黑", "PingFang SC", sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 16px' }}>

        {/* Logo + 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {/* VIRTAVO favicon SVG */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #4FA7A0 0%, #6C63FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 20px rgba(79,167,160,0.35)',
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <text x="6" y="24" fontSize="22" fontWeight="bold" fill="white" fontFamily="Arial">V</text>
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1a2b3c', margin: '0 0 4px' }}>
            售后管理系统
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
            VIRTAVO / ShowMo · 请登录以继续
          </p>
        </div>

        {/* 登录卡片 */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <form onSubmit={handleLogin}>

            {/* 账号选择 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                选择账号
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
              }}>
                {TEAM_MEMBERS.map(member => (
                  <button
                    key={member.name}
                    type="button"
                    onClick={() => { setSelectedUser(member.name); setError(''); }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      padding: '12px 8px',
                      borderRadius: 12,
                      border: selectedUser === member.name
                        ? `2px solid ${member.color}`
                        : '2px solid transparent',
                      background: selectedUser === member.name
                        ? `${member.color}15`
                        : '#F9FAFB',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* 头像 */}
                    <div style={{
                      width: 40, height: 40,
                      borderRadius: '50%',
                      background: member.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: 'white',
                      boxShadow: selectedUser === member.name
                        ? `0 0 0 3px ${member.color}40`
                        : 'none',
                    }}>
                      {member.avatar}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: selectedUser === member.name ? 600 : 400, color: '#374151' }}>
                      {member.name}
                    </span>
                    <span style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.2, textAlign: 'center' }}>
                      {member.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 密码输入 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  密码
                </label>
                {selectedMember && (
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                    默认密码: virtavo01
                  </span>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="请输入密码"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: error ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                  fontSize: 14,
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                  background: '#FAFAFA',
                }}
                onFocus={e => { e.target.style.borderColor = '#4FA7A0'; e.target.style.background = 'white'; }}
                onBlur={e => { e.target.style.borderColor = error ? '#EF4444' : '#E5E7EB'; }}
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: 13,
                marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                border: 'none',
                background: selectedMember
                  ? `linear-gradient(135deg, ${selectedMember.color}, ${selectedMember.color}cc)`
                  : 'linear-gradient(135deg, #4FA7A0, #4FA7A0cc)',
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                transition: 'all 0.15s',
                fontFamily: '"微软雅黑", sans-serif',
              }}
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>
        </div>

        {/* 底部版权 */}
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 24 }}>
          VIRTAVO / ShowMo 内部系统 · 仅供授权人员使用
        </p>
      </div>
    </div>
  );
}
