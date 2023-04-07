import React from 'react';
import { motion } from 'framer-motion';

type IconButtonProps = {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  additionalStyles?: string;
  disabled?: boolean;
};

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  title,
  icon,
  additionalStyles = '',
  disabled = false,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`icon-button ${additionalStyles}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 8,
        opacity: disabled ? 0.5 : 1,
        color: 'unset',
      }}
      disabled={disabled}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.button>
  );
};

export default IconButton;
