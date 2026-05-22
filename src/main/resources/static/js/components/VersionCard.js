import { mdToHtml } from "/js/markdown_viewer/index.js";

/**
 * @param {Object} ver - Dados da versão atual do loop
 * @param {Boolean} isChampion - Se esta versão é a atual campeã de votos
 * @returns {String} HTML string
 */
export function createVersionCard(ver, isChampion) {
  const dataFormatada = new Date(ver.createdAt).toLocaleString("pt-BR");
  const championBadge = isChampion
    ? `<span style="color: #a3d222; background: rgba(163, 210, 34, 0.1); padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight:bold; margin-left: 8px;">🏆 Atual Campeã</span>`
    : "";

  return `
    <div class="version-card" style="background: var(--card); padding: 20px; border-radius: 12px; border: 1px solid #223a4e; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 15px;">
      
      <div class="version-toggle-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
        <div>
          <h3 style="margin: 0; font-size: 1.3rem; color: #fff; display: inline-block; vertical-align: middle;">${ver.title}</h3>
          ${championBadge}
          <div style="font-size: 13px; color: #888; margin-top: 4px;">📅 Criada em: ${dataFormatada} <span style="color: #66c0f4; margin-left: 6px;">(Clique para ler ▼)</span></div>
        </div>
        
        <button class="upvote-btn" data-id="${ver.versionId}" style="cursor:pointer; background: #2a475e; color: white; border:none; padding: 8px 16px; border-radius: 6px; font-weight:bold; white-space: nowrap; transition: background 0.2s;">
          ▲ Votar (${ver.upvotes})
        </button>
      </div>
      
      <div class="version-content-wrapper">
        <div class="version-content-inner">
          <div class="markdown-body" style="font-size: 14.5px; padding-top: 15px; border-top: 1px solid rgba(34, 58, 78, 0.4); margin-top: 15px;">
            ${mdToHtml(ver.description)}
          </div>
        </div>
      </div>

    </div>
  `;
}
