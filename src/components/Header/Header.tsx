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
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <svg
                height="40px"
                width="40px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
              >
                <g>
                  <polygon
                    fill="#8B7E7F"
                    points="34.289,341.986 43.391,424.95 71.173,424.95 71.173,341.986 	"
                  />
                  <polygon
                    fill="#8B7E7F"
                    points="477.711,341.986 468.609,424.95 440.827,424.95 440.827,341.986 	"
                  />
                </g>
                <g>
                  <path
                    fill="#463836"
                    d="M422.639,312.421l-22.756,71.047l22.756,71.047c16.328,0,29.565-13.237,29.565-29.565v-82.963
		C452.205,325.659,438.968,312.421,422.639,312.421z"
                  />
                  <path
                    fill="#463836"
                    d="M59.795,341.986v82.963c0,16.329,13.237,29.565,29.565,29.565l22.756-71.047L89.36,312.42
		C73.032,312.421,59.795,325.659,59.795,341.986z"
                  />
                  <path
                    fill="#463836"
                    d="M437.02,87.53C388.665,39.186,324.38,12.551,256,12.551S123.335,39.186,74.98,87.53
		C26.624,135.886,0,200.17,0,268.551c0,7.908,6.411,14.319,14.319,14.319c7.909,0,14.319-6.411,14.319-14.319
		C28.638,142.986,130.435,41.189,256,41.189c125.465,0,227.197,101.637,227.359,227.063c-0.002,0.101-0.015,0.198-0.015,0.299
		c0,7.913,6.415,14.328,14.328,14.328S512,276.465,512,268.551C512,200.17,485.376,135.886,437.02,87.53z"
                  />
                </g>
                <path
                  fill="#605353"
                  d="M477.142,424.95c-4.714,0-8.533,0-8.533,0V321.555c0-0.668,0.079-1.335,0.233-1.983
	c3.97-16.61,5.984-33.775,5.984-51.019c0-120.661-98.164-218.827-218.825-218.827S37.175,147.893,37.175,268.553
	c0,17.244,2.014,34.409,5.984,51.019c0.155,0.649,0.233,1.315,0.233,1.983V424.95c0,0-3.82,0-8.533,0s-8.533-3.82-8.533-8.533
	v-93.864c-4.126-17.6-6.217-35.762-6.217-53.999C20.108,138.481,125.929,32.66,256,32.66s235.892,105.821,235.892,235.893
	c0,18.237-2.091,36.399-6.217,53.999v93.864C485.675,421.13,481.856,424.95,477.142,424.95z"
                />
                <g>
                  <path
                    fill="#F14742"
                    d="M377.706,267.488c-24.817,0-44.934,20.118-44.934,44.933v142.095
		c0,24.817,20.117,44.933,44.934,44.933c24.816,0,44.934-20.117,44.934-44.933V312.421
		C422.639,287.606,402.522,267.488,377.706,267.488z"
                  />
                  <path
                    fill="#F14742"
                    d="M134.294,267.488c-24.816,0-44.934,20.118-44.934,44.933v142.095
		c0,24.817,20.117,44.933,44.934,44.933s44.934-20.117,44.934-44.933V312.421C179.228,287.606,159.111,267.488,134.294,267.488z"
                  />
                </g>
              </svg>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map(({ link, label }) => (
                <NavLink key={link} href={link}>
                  {label}
                </NavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map(({ label, link }) => (
                <NavLink key={link} href={link}>
                  {label}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box backgroundColor={"#1a1920"} p={4}>
        <Outlet />
      </Box>
    </>
  );
}
