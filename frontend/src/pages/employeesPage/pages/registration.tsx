import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import http from '../../../utils/https';
import { endpoints } from '../../../configs/config';

const RegistrationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [tokenStatus, setTokenStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setError('未提供注册令牌。请使用您邀请邮件中的链接。');
            setIsLoading(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await http.post<{ result: string }>(endpoints.verifyTokenEndpoint, { token });
                setTokenStatus(response.data.result);
                
                if (response.data.result === 'valid') {
                    setIsTokenValid(true);
                    setMessage('令牌已验证。请设置您的密码。');
                }
            } catch (err) {
                setError('无效或已过期的令牌。请申请新的邀请。');
                setIsTokenValid(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('密码不匹配。');
            return;
        }
        
        // const token = searchParams.get('token');

        try {
            await http.post(endpoints.registerEndpoint, { email, password, userName});
            setMessage('注册成功！您现在可以登录了。');

            //添加作废令牌逻辑
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || '注册失败，请重试。');
        }
    };

    if (isLoading) {
        return (
            <div>
                <h2>注册</h2>
                <p>正在验证令牌...</p>
            </div>
        );
    }

    if (tokenStatus === 'unexist' || tokenStatus === 'expired') {
        return (
            <div>
                <h2>注册</h2>
                <p>无效或已过期的令牌。请申请新的邀请。</p>
            </div>
        );
    }

    if (tokenStatus === 'already_used') {
        return (
            <div>
                <h2>注册</h2>
                <p>该令牌已被使用。请申请新的邀请。</p>
            </div>
        );
    }

    return (
        <div>
            <h2>注册</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>邮箱：</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="请输入邮箱"
                        disabled={!isTokenValid}
                    />
                </div>
                <div>
                    <label>用户名：</label>
                    <input 
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="请输入用户名"
                        disabled={!isTokenValid}
                    />
                </div>
                <div>
                    <label>密码：</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        disabled={!isTokenValid}
                    />
                </div>
                <div>
                    <label>确认密码：</label>
                    <input 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="请确认密码"
                        disabled={!isTokenValid}
                    />
                </div>
                <button type="submit" disabled={!isTokenValid}>注册</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
