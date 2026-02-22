import { useParams, useNavigate } from 'react-router'
import { useTourDetail } from './hooks/useTourDetail'
import './App.css'

function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const contentId = id
  const { loading, error, tourDetail } = useTourDetail(contentId)

  const handleBack = () => {
    navigate('/')
  }

  if (!contentId) {
    return (
      <div className="app-container">
        <div className="error">
          <h2>잘못된 요청입니다</h2>
          <p>관광지 ID가 없습니다.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">로딩중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container">
        <button type="button" onClick={handleBack} className="back-button">
          뒤로가기
        </button>
        <div className="error">
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <p>contentId: {contentId}</p>
        </div>
      </div>
    )
  }

  if (!tourDetail) {
    return (
      <div className="app-container">
        <div className="empty">
          <h2>상세 정보가 없습니다</h2>
          <p>표시할 데이터가 없습니다.</p>
        </div>
      </div>
    )
  }

  // 주소: addr1 + (addr2 있으면 붙여서)
  const fullAddress = tourDetail.addr2
    ? `${tourDetail.addr1} ${tourDetail.addr2}`
    : tourDetail.addr1

  const hasValidTel = tourDetail.tel && tourDetail.tel !== '전화번호 정보 없음'

  // 홈페이지: https:// 없으면 붙여서 href에 씀
  let homepageUrl = tourDetail.homepage || ''
  if (homepageUrl && !/^https?:\/\//i.test(homepageUrl)) {
    homepageUrl = 'https://' + homepageUrl
  }

  return (
    <div className="app-container">
      <button type="button" onClick={handleBack} className="back-button">
        뒤로가기
      </button>

      <div className="modal-body">
        {tourDetail.firstImage && (
          <div className="modal-image-wrapper">
            <img
              src={tourDetail.firstImage}
              alt={tourDetail.title}
              className="modal-image"
              onError={(e) => {
                const img = e.target
                img.style.display = 'none'
                img.parentElement.style.background = '#e0e0e0'
                img.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;">이미지 없음</div>'
              }}
            />
          </div>
        )}

        <h1 className="modal-title">{tourDetail.title}</h1>

        <div className="modal-info">
          <div className="modal-info-item">
            <strong>주소:</strong>
            <span>{fullAddress}</span>
          </div>
          {hasValidTel && (
            <div className="modal-info-item">
              <strong>전화번호:</strong>
              <span>{tourDetail.tel}</span>
            </div>
          )}
          {tourDetail.homepage && (
            <div className="modal-info-item modal-info-item--homepage">
              <a
                href={homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="새창 : 홈페이지로 이동"
                className="modal-link-button modal-link-button--homepage"
              >
                홈페이지 바로가기
              </a>
            </div>
          )}
        </div>

        <div className="modal-overview">
          <h2>개요</h2>
          <p>{tourDetail.overview}</p>
        </div>

        {tourDetail.mapx && tourDetail.mapy && (
          <div className="modal-map">
            <h2>위치</h2>
            <p>좌표: {tourDetail.mapx}, {tourDetail.mapy}</p>
            <a
              href={`https://map.kakao.com/link/map/${tourDetail.title},${tourDetail.mapy},${tourDetail.mapx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link-button"
            >
              카카오맵에서 보기
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Detail
