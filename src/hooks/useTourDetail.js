import { useState, useEffect } from 'react'

const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY || ''

// 상세 API 주소 만드는 함수 (관광지 ID 넣으면 URL 나옴)
function buildApiUrl(contentId) {
  const params = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    MobileOS: 'ETC',
    MobileApp: 'TestApp',
    _type: 'json',
    contentId: String(contentId),
  })
  return `/api/B551011/KorService2/detailCommon2?${params.toString()}`
}

// 관광지 ID를 넣으면 → 로딩/에러/상세정보 를 돌려주는 훅
export function useTourDetail(contentId) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tourDetail, setTourDetail] = useState(null)

  useEffect(() => {
    if (!contentId) {
      setTourDetail(null)
      setError(null)
      setLoading(false)
      return
    }

    async function fetchTourDetail() {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = buildApiUrl(contentId)
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()

        // API가 에러 코드를 주면 메시지로 던짐
        if (json?.response?.header?.resultCode !== '0000') {
          const msg = json?.response?.header?.resultMsg ?? '알 수 없는 오류'
          throw new Error(`API 오류: ${msg}`)
        }

        // item이 배열일 수도 객체 하나일 수도 있어서 통일
        const rawItem = json?.response?.body?.items?.item
        const item = Array.isArray(rawItem) ? rawItem[0] : rawItem

        if (!item) {
          throw new Error('상세 정보를 찾을 수 없습니다.')
        }

        // 화면에서 쓰기 쉽게 필요한 것만 뽑기
        const detail = {
          contentId: item?.contentid ?? '',
          title: item?.title ?? '제목 없음',
          addr1: item?.addr1 ?? '주소 정보 없음',
          addr2: item?.addr2 ?? '',
          firstImage: item?.firstimage ?? null,
          firstImage2: item?.firstimage2 ?? null,
          overview: item?.overview ?? '상세 정보가 없습니다.',
          tel: item?.tel ?? '전화번호 정보 없음',
          homepage: item?.homepage ?? '',
          mapx: item?.mapx ?? '',
          mapy: item?.mapy ?? '',
        }

        setTourDetail(detail)
      } catch (err) {
        setError(err.message ?? '상세 정보를 불러오는 중 오류가 발생했습니다.')
        setTourDetail(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTourDetail()
  }, [contentId])

  return { loading, error, tourDetail }
}
