import Navbar from '../components/shared/Layout/Navbar';
import Hero from '../components/public/Hero';
import About from '../components/public/About';
import Skills from '../components/public/Skills';
import Portfolio from '../components/public/Portfolio';
import Contact from '../components/public/Contact';
import Footer from '../components/public/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home;