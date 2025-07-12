import React, {useState}from 'react'
import CredentialsSignInPage from '../components/signIn'
import TrueFocus from '../components/TrueFocus';
import logo from '../assets/logo1.png';

export default function LoginPage():React.ReactNode{

    return(
        <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            width: '100vw',
            overflow: 'hidden'
        }}>
            {/* 左边品牌展示区域 */}
            <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                flex: '0 0 40%', // 固定占40%宽度
                height: '100%',
                padding: '2rem',
                // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <TrueFocus 
                        sentence="Pilot Technologies"
                        manualMode={false}
                        blurAmount={5}
                        borderColor="#18b3fe"
                        animationDuration={2}
                        pauseBetweenAnimations={1}
                    />
                </div>
                    
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img 
                        src={logo} 
                        alt="logo" 
                        style={{
                            maxWidth: '300px',
                            height: 'auto'
                        }}
                    />
                </div>
            </div>

            {/* 右边登录区域 */}
            <div style={{
                flex: '1', // 占据剩余空间
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // padding: '2rem',
                backgroundColor: '#f5f5f5',
                // border: '1px solid black'
                // width: '60vw'
                
                
            }}>
                <div style={{
                    flex:1,
                    width: '100%',
                    // maxWidth: '400px', // 限制最大宽度
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <CredentialsSignInPage/>
                </div>
            </div>
        </div>
    )
}

