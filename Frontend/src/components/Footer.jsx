import { APP_NAME } from '../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          &copy; {currentYear} {APP_NAME}. All rights reserved.
        </p>
      </div>

      <style>{`
        .footer {
          background: var(--color-white);
          border-top: 1px solid var(--color-gray-200);
          padding: var(--spacing-lg) 0;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
          text-align: center;
        }

        .footer-container p {
          font-size: var(--font-size-sm);
          color: var(--color-gray-500);
          margin-bottom: 0;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
