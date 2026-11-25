import React from 'react';

function Icon({ className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      {...props}
    >
      {props.children}
    </svg>
  );
}

export const BrandMarkIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
    className={`icon ${props.className || ""}`}
    aria-hidden="true"
    {...props}
  >
    <path
      d="M5 10 11 35 17 18 23 35 29 10"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m22 10 8 25 8-25"
      stroke="var(--highlight)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HomeIcon = (props) => (
  <Icon {...props}>
    <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z" />
  </Icon>
);

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6" />
    <line x1="17" y1="17" x2="21" y2="21" />
  </Icon>
);

export const BellIcon = (props) => (
  <Icon {...props}>
    <path d="M18 8a6 6 0 0 0-12 0c0 3.4-1 4.6-2 5.5h16c-1-0.9-2-2.1-2-5.5" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
);

export const MessageIcon = (props) => (
  <Icon {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);

export const UsersIcon = (props) => (
  <Icon {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

export const BookmarkIcon = (props) => (
  <Icon {...props}>
    <path d="M6 4h12v16l-6-4-6 4V4Z" />
  </Icon>
);

export const ProfileIcon = (props) => (
  <Icon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

export const EyeIcon = (props) => (
  <Icon {...props}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </Icon>
);

export const EyeOffIcon = (props) => (
  <Icon {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-3.1 3.6" />
    <path d="M6.2 6.2C3.9 7.7 2.5 12 2.5 12s3.5 6 9.5 6c1 0 1.9-.2 2.7-.5" />
  </Icon>
);

export const LockIcon = (props) => (
  <Icon {...props}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 14v3" />
  </Icon>
);

export const ShieldIcon = (props) => (
  <Icon {...props}>
    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const WarningIcon = (props) => (
  <Icon {...props}>
    <path d="m12 3 10 18H2L12 3Z" />
    <path d="M12 9v5" />
    <path d="M12 17h.01" />
  </Icon>
);

export const CameraIcon = (props) => (
  <Icon {...props}>
    <path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
    <circle cx="12" cy="14" r="4" />
  </Icon>
);

export const ImageIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </Icon>
);

export const SettingsIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" />
  </Icon>
);

export const PlusIcon = (props) => (
  <Icon {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

export const StopIcon = (props) => (
  <Icon {...props}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
  </Icon>
);

export const MicIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
    <path d="M19 10a7 7 0 0 1-14 0" />
    <path d="M12 19v3" />
    <path d="M8 22h8" />
  </Icon>
);

export const SmileIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M8 14c1.333 2 3.333 2 4 2s2.667 0 4-2" />
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
  </Icon>
);

export const ReplyIcon = (props) => (
  <Icon {...props}>
    <path d="M10 14L5 9l5-5" />
    <path d="M5 9h9a7 7 0 0 1 7 7v1" />
  </Icon>
);

export const ShareIcon = (props) => (
  <Icon {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 10.5 6.8-4" />
    <path d="m8.6 13.5 6.8 4" />
  </Icon>
);

export const HeartIcon = ({
  fill = "var(--crimson)",
  stroke = "var(--crimson)",
  strokeWidth = "1.4",
  ...props
}) => (
  <Icon {...props} fill={fill} stroke={stroke} strokeWidth={strokeWidth}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </Icon>
);

export const HeartOutlineIcon = ({
  fill = "var(--ink3)",
  stroke = "var(--ink4)",
  strokeWidth = "1.4",
  ...props
}) => (
  <Icon {...props} fill={fill} stroke={stroke} strokeWidth={strokeWidth}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </Icon>
);

export const FlameIcon = (props) => (
  <Icon {...props}>
    <path d="M12 22s-4-4.5-4-8a4 4 0 0 1 8 0c0 3.5-4 8-4 8Z" />
    <path d="M12 2s6 4 6 9a6 6 0 0 1-12 0c0-5 6-9 6-9Z" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

export const PencilIcon = (props) => (
  <Icon {...props}>
    <path d="m12 20 8-8-6-6-8 8v6h6Z" />
    <path d="M15.5 4.5 18.5 7.5" />
  </Icon>
);

export const PlayIcon = (props) => (
  <Icon {...props}>
    <path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none" />
  </Icon>
);

export const PauseIcon = (props) => (
  <Icon {...props}>
    <rect x="7" y="5" width="3" height="14" rx="1" />
    <rect x="14" y="5" width="3" height="14" rx="1" />
  </Icon>
);

export const MusicNoteIcon = (props) => (
  <Icon {...props}>
    <path d="M9 18V6l10-2v12" />
    <circle cx="7" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </Icon>
);

export const CalendarIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 11h18" />
  </Icon>
);

export const GraduationCapIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
    <path d="M6 12.5v4.5c0 1.5 2 3 6 3s6-1.5 6-3v-4.5" />
    <path d="M12 7v8" />
  </Icon>
);

export const TrophyIcon = (props) => (
  <Icon {...props}>
    <path d="M6 3h12v5c0 3-2 5-4 5H10c-2 0-4-2-4-5V3Z" />
    <path d="M8 14h8v3H8v-3Z" />
    <path d="M9 20h6" />
  </Icon>
);

export const CircleIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8" />
  </Icon>
);

export const CommunityIcon = (props) => (
  <Icon {...props}>
    <circle cx="8" cy="9" r="3" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h2" />
    <path d="M16 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    <path d="M13 21v-2a4 4 0 0 0-4-4h-1" />
  </Icon>
);

export const EmptyBellIcon = (props) => (
  <Icon {...props}>
    <path d="M12 2a6 6 0 0 0-6 6v4s-1 2-1 3h14c0-1-1-3-1-3V8a6 6 0 0 0-6-6Z" />
    <path d="M8 22h8" />
  </Icon>
);
