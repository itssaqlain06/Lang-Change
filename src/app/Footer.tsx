import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-center p-4 border-t border-gray-200 dark:border-gray-700 mt-28">
      <div className="flex justify-center gap-4 mb-2">
        <a
          href="https://www.linkedin.com/in/itssaqlain06/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-300 hover:text-[#0A66C2] dark:hover:text-[#0A66C2]"
        >
          <FaLinkedin size={20} />
        </a>
        <a
          href="https://github.com/itssaqlain06"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-300 hover:text-[#181717] dark:hover:text-[#181717]"
        >
          <FaGithub size={20} />
        </a>
        <a
          href="https://www.instagram.com/itssaqlain06"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-300 hover:text-[#E1306C] dark:hover:text-[#E1306C]"
        >
          <FaInstagram size={20} />
        </a>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        A powerful translator built with Next.js, Tailwind CSS, and LangChain.
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Made with <span role="img" aria-label="heart">💖</span> by{' '}
        <a
          href="https://github.com/itssaqlain06"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-indigo-600"
        >
          Saqlain
        </a>
      </p>
    </footer>
  );
}
