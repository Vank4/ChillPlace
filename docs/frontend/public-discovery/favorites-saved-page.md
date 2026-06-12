# Favorites Saved Page `/saved` va `/favorites`

## Trang Vua Hoan Thanh

Da nang cap trang **Favorites/Saved Page** tu man hinh danh sach saved co ban thanh trang quan ly noi dung da luu hoat dong duoc bang mock API, state va localStorage.

Trang nay dua tren prototype:

- `interface_design/favorites_saved__desktop__base/code.html`
- `interface_design/favorites_saved__responsive__base/code.html`

## File Duoc Them/Sua/Xoa

- `apps/web/src/features/saved/pages/SavedPlacesPage.jsx`
  - Viet lai page component cho `/saved` va `/favorites`.
  - Lay danh sach dia diem da luu bang `getPlaces({ savedOnly: true })`.
  - Doc danh sach id da luu bang `getSavedPlaceIds()`.
  - Bo luu/lưu lai dia diem bang `toggleSavedPlace(placeId)`.
  - Them search trong danh sach da luu.
  - Them tab `Dia diem` va `Bai viet`.
  - Tab dia diem dung lai `PlaceCard` cua Explore de giu UI thong nhat.
  - Tab bai viet dung mock posts cuc bo trong page vi backend/post service chua co.
  - CTA:
    - `Kham pha them` sang `/explore`.
    - Card dia diem sang `/places/:placeId`.
    - Nut chi duong sang `/map?place=:placeId`.

- `apps/web/src/features/saved/pages/SavedPlacesPage.css`
  - Tao CSS rieng cho trang saved.
  - Them hero `Khong gian cua anh`.
  - Them quick stats:
    - so dia diem da luu.
    - so dia diem dang mo.
    - rating trung binh.
  - Them toolbar gom search va tabs.
  - Them empty state cho truong hop chua luu gi hoac search khong co ket qua.
  - Them post list cho tab bai viet.
  - Responsive:
    - Mobile: grid dia diem 2 cot, toolbar va stats thu gon.
    - Tablet/Desktop: layout rong hon, grid 2-3 cot.

## Chi Tiet Code Da Trien Khai

- State chinh trong `SavedPlacesPage.jsx`:
  - `activeTab`: quan ly tab `places` hoac `posts`.
  - `keyword`: tu khoa tim trong noi dung da luu.
  - `places`: danh sach dia diem da luu lay tu mock service.
  - `savedPlaceIds`: danh sach id dia diem da luu trong localStorage.
  - `isLoading`: loading state khi goi mock API.

- Search:
  - Ham `normalizeText(...)` bo dau tieng Viet de search linh hoat.
  - Search tren dia diem theo:
    - ten.
    - category.
    - khu vuc.
    - tags.
  - Search tren bai viet theo:
    - title.
    - author.
    - tag.

- Dia diem da luu:
  - Lay bang `getPlaces({ savedOnly: true })`.
  - Neu bam bookmark tren card thi goi `toggleSavedPlace(placeId)`.
  - Sau khi bo luu, state `savedPlaceIds` thay doi va page tu load lai danh sach.

- Bai viet da luu:
  - Hien tai la mock frontend cuc bo `savedPosts`.
  - Chua co route Post Detail nen day la functional UI demo.
  - Sau nay co backend co the tach thanh `post.service.js`.

## Route Lien Quan

- `/saved`
  - Route chinh cho trang da luu.

- `/favorites`
  - Alias route, render cung `SavedPlacesPage`.

- `/places/:placeId`
  - Mo chi tiet dia diem khi bam card.

- `/map?place=:placeId`
  - Mo ban do va focus dia diem khi bam chi duong.

## Du Lieu Mock Dang Dung

- `apps/web/src/services/place.service.js`
  - `getPlaces({ savedOnly: true })`
  - `getSavedPlaceIds()`
  - `toggleSavedPlace(placeId)`

- `apps/web/src/mocks/places.mock.js`
  - Du lieu dia diem duoc filter theo id da luu trong localStorage.

- `apps/web/src/features/saved/pages/SavedPlacesPage.jsx`
  - `savedPosts` mock cho tab bai viet.

## Kiem Thu

Da chay:

```bash
cd apps/web
npm run build
```

Ket qua:

```text
✓ built in 2.12s
```

## Giai Thich Cho Giang Vien

Neu hoi trang da luu nam o dau:

- `apps/web/src/features/saved/pages/SavedPlacesPage.jsx`
- `apps/web/src/features/saved/pages/SavedPlacesPage.css`

Neu hoi danh sach dia diem da luu lay tu dau:

- Page goi `getPlaces({ savedOnly: true })`.
- Service doc localStorage key `chillplace.savedPlaces`.
- Sau do loc mock places theo cac id da luu.

Neu hoi vi sao chua co bai viet that:

- Phan bai viet dang la mock UI de hoan thien flow frontend.
- Sau nay khi co backend/post API se tach sang `post.service.js` va thay `savedPosts` bang API.

Neu hoi thao tac bo luu hoat dong nhu the nao:

- Bookmark tren `PlaceCard` goi `onToggleSave`.
- `SavedPlacesPage` xu ly bang `toggleSavedPlace(placeId)`.
- State `savedPlaceIds` cap nhat, page tu load lai danh sach saved.
