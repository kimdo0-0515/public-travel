// 목록에서 보여주는 관광지 카드 한 장 (이미지 + 제목 + 주소)
function TourCard({ tour, onClick }) {
  const { contentId, title, addr1, firstImage } = tour

  const handleClick = () => {
    if (onClick) onClick(contentId)
  }

  // 이미지 로드 실패 시 → "이미지 없음" 표시
  const handleImageError = (e) => {
    const img = e.target
    img.style.display = 'none'
    img.parentElement.style.background = '#e0e0e0'
    img.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:0.9rem;">이미지 없음</div>'
  }

  return (
    <div
      className="tour-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label={`${title} 상세 정보 보기`}
    >
      <div className="tour-card__image-wrapper">
        {firstImage ? (
          <img
            src={firstImage}
            alt={title}
            className="tour-card__image"
            onError={handleImageError}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#e0e0e0', color: '#999', fontSize: '0.9rem' }}>
            이미지 없음
          </div>
        )}
      </div>
      <div className="tour-card__content">
        <h3 className="tour-card__title">{title}</h3>
        <p className="tour-card__address">{addr1}</p>
      </div>
    </div>
  )
}

export default TourCard
