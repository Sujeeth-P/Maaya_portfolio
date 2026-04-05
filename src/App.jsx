import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Why from './components/Why.jsx'
import Testimonials from './components/Testimonials.jsx'
import FAQ from './components/FAQ.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'
import Modal from './components/Modal.jsx'
import ThankYou from './components/ThankYou.jsx'

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = () => {
    closeModal()
    setShowThankYou(true)
    window.scrollTo(0, 0)
  }

  const handleReturn = () => {
    setShowThankYou(false)
    window.scrollTo(0, 0)
  }

  if (showThankYou) {
    return <ThankYou onReturn={handleReturn} />
  }

  return (
    <>
      <Navbar onOpenModal={openModal} />

      <main>
        <Hero onOpenModal={openModal} />
        <Services onOpenModal={openModal} />
        <Process />
        <Why onOpenModal={openModal} />
        <Testimonials />
        <FAQ />
        <FinalCTA onOpenModal={openModal} />
      </main>

      <Footer />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  )
}
