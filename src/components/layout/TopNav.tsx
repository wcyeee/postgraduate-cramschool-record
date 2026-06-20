import type { Page } from '../../types/nav';

interface TopNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function TopNav({ activePage, onNavigate }: TopNavProps) {
  return (
    <div className="topnav">
      <div className="topnav-logo" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="material-symbols-rounded">menu_book</span>
        <div>補習班</div>
      </div>
      <div
        className={`nav-item${activePage === 'home' ? ' active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        首頁
      </div>
      <div
        className={`nav-item desktop-only${activePage === 'lessons' ? ' active' : ''}`}
        onClick={() => onNavigate('lessons')}
      >
        課程記錄 &amp; 排課管理
      </div>
      <div
        className={`nav-item mobile-only${activePage === 'lessons' ? ' active' : ''}`}
        onClick={() => onNavigate('lessons')}
      >
        課程記錄
      </div>
      <div
        className={`nav-item mobile-only${activePage === 'schedule' ? ' active' : ''}`}
        onClick={() => onNavigate('schedule')}
      >
        排課管理
      </div>
    </div>
  );
}
