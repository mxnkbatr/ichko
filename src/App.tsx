import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { HomePage } from './pages/HomePage'
import { PlaceDetailsPage } from './pages/PlaceDetailsPage'
import { BookingPage } from './pages/BookingPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { BookingsPage } from './pages/BookingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { AboutPage } from './pages/AboutPage'
import { FiltersPage } from './pages/FiltersPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/filters" element={<FiltersPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/place/:placeId" element={<PlaceDetailsPage />} />
        <Route path="/place/:placeId/book" element={<BookingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
