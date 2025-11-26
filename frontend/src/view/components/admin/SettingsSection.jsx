import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faBell,
  faLock,
  faPalette,
  faGlobe,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

function SettingsSection() {
  const settingCards = [
    {
      icon: faUsers,
      title: 'Account Settings',
      description: 'Manage your profile, password, and account preferences',
      buttonText: 'Manage Account',
      buttonClass: 'secondary'
    },
    {
      icon: faBell,
      title: 'Notifications',
      description: 'Configure email and push notification preferences',
      buttonText: 'Configure',
      buttonClass: 'secondary'
    },
    {
      icon: faLock,
      title: 'Security',
      description: 'Two-factor authentication and security settings',
      buttonText: 'Security Settings',
      buttonClass: 'secondary'
    },
    {
      icon: faPalette,
      title: 'Appearance',
      description: 'Customize theme, display, and interface preferences',
      buttonText: 'Customize',
      buttonClass: 'secondary'
    },
    {
      icon: faGlobe,
      title: 'Language & Region',
      description: 'Set your language, timezone, and regional preferences',
      buttonText: 'Change Settings',
      buttonClass: 'secondary'
    }
  ];

  return (
    <div className="admin-settings-container">
      <div className="admin-settings-grid">
        {settingCards.map((card, index) => (
          <div key={index} className="admin-setting-card">
            <div className="admin-setting-icon">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <button className={`admin-action-btn ${card.buttonClass}`}>
              {card.buttonText}
            </button>
          </div>
        ))}
        
        <div className="admin-setting-card logout-card">
          <div className="admin-setting-icon logout-icon-admin">
            <FontAwesomeIcon icon={faSignOutAlt}/>
          </div>
          <h3>Log Out</h3>
          <p>Sign out of your admin account</p>
          <button 
            className="admin-action-btn danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                window.location.href = '/';
              }
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;
