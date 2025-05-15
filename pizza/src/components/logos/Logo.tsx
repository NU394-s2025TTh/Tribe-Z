import { Link } from 'react-router-dom';
export default function Logo({ className }: { className?: string }) {
  const logo = "logo/doughjo_main.png";
  return (
  <div className={className ?? ''}>
    <Link to={"/"}>
      <img src={logo} />
    </Link>
  </div>);
}
