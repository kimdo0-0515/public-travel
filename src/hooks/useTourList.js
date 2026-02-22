import { useState, useEffect } from 'react'

const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY || ''

// 목록 API 주소 만드는 함수 (카테고리 번호 넣으면 URL 나옴)
function buildApiUrl(contentTypeId) {
  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    numOfRows: '100',
    pageNo: '1',
    MobileOS: 'ETC',
    MobileApp: 'TestApp',
    _type: 'json',
    contentTypeId: String(contentTypeId),
  })
  return `/api/B551011/KorService2/areaBasedList2?${params.toString()}`
}

// 카테고리 번호를 넣으면 → 로딩/에러/관광지목록 을 돌려주는 훅
export function useTourList(contentTypeId) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tourList, setTourList] = useState([])

  useEffect(() => {
    async function fetchTourList() {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = buildApiUrl(contentTypeId)
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()

        // API가 item을 배열로 줄 수도 있고, 객체 하나로 줄 수도 있어서 통일
        const rawItems = json?.response?.body?.items?.item ?? []
        const itemArray = Array.isArray(rawItems) ? rawItems : [rawItems].filter(Boolean)

        // 우리가 쓰기 쉬운 형태로만 정리 (contentId, title, addr1, firstImage)
        const list = itemArray.map((item) => ({
          contentId: item?.contentid ?? '',
          title: item?.title ?? '제목 없음',
          addr1: item?.addr1 ?? '주소 정보 없음',
          firstImage: item?.firstimage ?? null,
        }))

        setTourList(list)
      } catch (err) {
        setError(err.message ?? '데이터를 불러오는 중 오류가 발생했습니다.')
        setTourList([])
      } finally {
        setLoading(false)
      }
    }

    fetchTourList()
  }, [contentTypeId])

  return { loading, error, tourList }
}
