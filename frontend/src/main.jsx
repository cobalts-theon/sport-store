import { createRoot } from 'react-dom/client'
import './index.css'
import App from './view/App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import

// Thay CLIENT_ID bằng mã bạn lấy ở Bước 1
const CLIENT_ID = "502885387898-qq6r8d4vbeeut3j7l95hpnot793uvibv.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
)