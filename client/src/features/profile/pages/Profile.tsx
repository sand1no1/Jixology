import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  const [avatarSvg, setAvatarSvg] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      // Using the DiceBear HTTP API — no package install needed
      // Seed is based on the user's name for a consistent avatar
      const seed = encodeURIComponent('Juan Guarnizo');
      const url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
      
      try {
        const res = await fetch(url);
        const svg = await res.text();
        setAvatarSvg(svg);
      } catch (err) {
        console.error('Failed to load DiceBear avatar:', err);
      }
    };

    fetchAvatar();
  }, []);

  return (
    <div className="profile-page">

      {/* Left card */}
      <div className="profile-card">
        <div className="avatar-wrapper">
          {avatarSvg ? (
            <div
              className="avatar-circle"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />
          ) : (
            <div className="avatar-circle avatar-placeholder" />
          )}
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span>Nombre: Juan Guarnizo</span>
          </div>
          <div className="info-row">
            <span>Edad: 99</span>
          </div>
          <div className="info-row">
            <span>Fecha de Nacimiento: 01/01/1987</span>
          </div>
          <div className="info-row">
            <span>Telefono: 81 22544 4444</span>
          </div>
          <div className="info-row">
            <span>Correo: juan.guarnizo@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="profile-right">

        {/* About me */}
        <div className="profile-section">
          <div className="section-tab">Sobre mi</div>
          <div className="section-body">
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit, potenti justo nostra tristique ullamcorper curae sociis, bibendum enim turpis hendrerit mauris magnis.</p>
          </div>
        </div>

        {/* Cosmetics */}
        <div className="profile-section">
          <div className="section-tab">Cosmeticos Obtenidos</div>
          <div className="section-body cosmetics-body">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="cosmetic-item" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;