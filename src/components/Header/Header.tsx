import { ReactNode } from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Outlet, useNavigate } from "react-router-dom";

const Links = [
  { label: "Cerca", link: "/home" },
  { label: "Musica scaricata", link: "/songs" },
  { label: "Impostazioni", link: "/config" },
];

const NavLink = ({ children, href }: { children: ReactNode; href: string }) => {
  const navigate = useNavigate();
  return <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      color: "#f9ab00",
    }}
    onClick={(e) => {
      e.preventDefault();
      navigate(href)
    }}
    href={href}
  >
    {children}
  </Link>
};

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        bg={"#1a191f"}
        borderBottom={"1px solid #222028"}
        color={"#fff"}
        px={4}
      >
      <Outlet />
      </Box>
    </>
  );
}
