import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PlaceholderSection({ icon, title, description }) {
  return (
    <div className="admin-placeholder">
      <FontAwesomeIcon icon={icon} className="placeholder-icon" />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default PlaceholderSection;
