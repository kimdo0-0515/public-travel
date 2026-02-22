import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTourList } from './hooks/useTourList'
import TourCard from './components/TourCard'
import CategorySelector from './components/CategorySelector'
import { DEFAULT_CONTENT_TYPE_ID, getContentTypeName } from './constants/contentTypes'
import './App.css'

// 검색할 때 쓰는 API 키 ( .env 에서 가져옴 )
const API_KEY = import.meta.env.VITE_SERVICE_KEY || ''

function App() {
  const navigate = useNavigate()
  const [contentTypeId, setContentTypeId] = useState(DEFAULT_CONTENT_TYPE_ID)
  const { loading, error, tourList } = useTourList(contentTypeId)

  // 검색용 변수들
  const [searchWord, setSearchWord] = useState('')
  const [searchResultList, setSearchResultList] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [didSearch, setDidSearch] = useState(false)

  const handleContentTypeChange = (newContentTypeId) => {
    setContentTypeId(newContentTypeId)
  }

  const handleCardClick = (contentId) => {
    navigate(`/detail/${contentId}`)
  }

  // 검색 버튼 누르면 이 함수 실행됨 (목록/상세와 같은 KorService2 사용)
  const handleSearch = async () => {
    const word = searchWord.trim()
    if (!word) return

    setSearchLoading(true)
    setDidSearch(true)
    setSearchResultList([])

    try {
      const params = new URLSearchParams({
        serviceKey: API_KEY,
        keyword: word,
        MobileOS: 'ETC',
        MobileApp: 'TestApp',
        _type: 'json',
        numOfRows: '20',
        pageNo: '1',
      })
      const url = '/api/B551011/KorService2/searchKeyword2?' + params.toString()
      const res = await fetch(url)
      const json = await res.json()

      // 왜 결과가 안 나오는지 확인용 (개발자도구 콘솔에서 확인)
      console.log('검색 API 응답 상태:', res.status)
      console.log('검색 API 전체 응답:', json)
      console.log('resultCode:', json.response?.header?.resultCode)
      console.log('resultMsg:', json.response?.header?.resultMsg)
      console.log('body.items:', json.response?.body?.items)

      if (json.response?.header?.resultCode !== '0000') {
        setSearchResultList([])
        setSearchLoading(false)
        return
      }

      const items = json.response?.body?.items
      const item = items?.item
      let list = []
      if (Array.isArray(item)) {
        list = item
      } else if (item && typeof item === 'object') {
        list = [item]
      }

      const result = list.map((one) => ({
        contentId: one.contentid || one.contentId || '',
        title: one.title || '제목 없음',
        addr1: one.addr1 || '주소 없음',
        firstImage: one.firstimage || one.firstImage || null,
      }))
      setSearchResultList(result)
    } catch (err) {
      setSearchResultList([])
    }
    setSearchLoading(false)
  }

  // 엔터 치면 검색
  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  // 검색 결과를 보여줄지, 카테고리 목록을 보여줄지
  const showSearchResult = didSearch

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>★ 광광사이트 ★</h1>
      </header>

      <section className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="검색어 입력"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyDown={onSearchKeyDown}
        />
        <button type="button" className="search-button" onClick={handleSearch}>
          검색
        </button>
      </section>

      {!showSearchResult && (
        <section className="category-section">
          <CategorySelector
            selectedContentTypeId={contentTypeId}
            onChange={handleContentTypeChange}
          />
        </section>
      )}

      <main className="content-section">
        {showSearchResult ? (
          <>
            {searchLoading && <div className="loading">검색중...</div>}
            {!searchLoading && searchResultList.length === 0 && didSearch && (
              <div className="empty">
                <h2>"{searchWord}" 검색결과가 없습니다</h2>
                <p>다른 단어로 검색해 보세요.</p>
                <p className="search-back">
                  <button type="button" className="back-button" onClick={() => setDidSearch(false)}>
                    카테고리 목록 보기
                  </button>
                </p>
              </div>
            )}
            {!searchLoading && searchResultList.length > 0 && (
              <>
                <div className="content-header">
                  <h2>검색 결과</h2>
                  <span className="content-count">총 {searchResultList.length}개</span>
                </div>
                <p className="search-back">
                  <button type="button" className="back-button" onClick={() => setDidSearch(false)}>
                    카테고리 목록 보기
                  </button>
                </p>
                <div className="tour-list">
                  {searchResultList.map((tour, index) => (
                    <TourCard
                      key={tour.contentId || index}
                      tour={tour}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {loading && <div className="loading">로딩중...</div>}
            {!loading && error && (
              <div className="error">
                <h2>오류가 발생했습니다</h2>
                <p>{error}</p>
              </div>
            )}
            {!loading && !error && (!tourList || tourList.length === 0) && (
              <div className="empty">
                <h2>{getContentTypeName(contentTypeId)} 정보가 없습니다</h2>
                <p>표시할 데이터가 없습니다.</p>
              </div>
            )}
            {!loading && !error && tourList && tourList.length > 0 && (
              <>
                <div className="content-header">
                  <h2>{getContentTypeName(contentTypeId)} 목록</h2>
                  <span className="content-count">총 {tourList.length}개</span>
                </div>
                <div className="tour-list">
                  {tourList.map((tour, index) => (
                    <TourCard
                      key={tour.contentId || index}
                      tour={tour}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
