import { THEME_COLOR } from '@/theme/index';
import { Box, useColorMode } from '@chakra-ui/react';
import LinkChakra from './link-chakra';

type LogoMode = 'dotcom' | 'nomaikura' | 'manoikura';

interface Props {
  fill?: string;
  logoSelection: LogoMode;
}

const PathSelecter = ({ mode }: { mode: LogoMode }) => {
  let Path = (
    <>
      <path d="M43.53 59.25l-28-28v28H0V0h6.32l28 28V0h15.6v59.25zM56.2 59.25L83.82 0h7l27.88 59.25h-15.5l-3.63-7.74H75.28l-3.55 7.74zm25.17-20.86h12.08l-6-13zM124.9 0h25a21.77 21.77 0 01.3 43.53h-9.71v15.72H124.9zm15.56 30.09h9.64a8.5 8.5 0 100-17h-9.64zM206.66 0a29.63 29.63 0 11-29.54 29.7A29.7 29.7 0 01206.66 0zm0 15.48a14.14 14.14 0 1014.14 14.14 14.11 14.11 0 00-14.14-14.14zM234.71 59.25L262.35 0h7l27.89 59.25h-15.53l-3.64-7.74h-24.25l-3.55 7.74zm25.2-20.86h12.08l-6-13zM346.96 59.25l-28-28v28h-15.52V0h6.31l28.05 28V0h15.56v59.25zM367.03 46.61a6.11 6.11 0 016.24 6.24 6.24 6.24 0 11-12.48 0 6.11 6.11 0 016.24-6.24zM418.93 19.59a13.83 13.83 0 00-10-3.87 13.45 13.45 0 00-13.91 13.9 14.08 14.08 0 0023.86 10l11.06 10.9a29.62 29.62 0 11-21-50.48 29.31 29.31 0 0120.85 8.61zM465.3 0a29.63 29.63 0 11-29.54 29.7A29.7 29.7 0 01465.3 0zm0 15.48a14.14 14.14 0 1014.14 14.14 14.11 14.11 0 00-14.14-14.14zM535.2 21.96l24.09-22h7v59.29H550.7V28.83l-15.5 14.14-15.55-14.06v30.34h-15.64V0h7z"></path>
    </>
  );

  if (mode == 'manoikura') {
    Path = (
      <>
        <path d="M0 170h150v40H0zm350 0h120v40H350zM160 270h180v40H160z" className="a"></path>
        <path
          d="M300 170h40v113h-40zm180 50h160v40H480zm0-50h160v40H480zm-370 20h40v120h-40z"
          className="a"
        ></path>
        <path
          d="M600 230h40v100h-40zm-120 60h120v40H480zm-130 0h90v40h-90zM23 270h97v40H23z"
          className="a"
        ></path>
        <path
          d="M0 250h40v80H0zm350-80h40v110h-40zm-190 0h30v90h-30zm100 0h30v90h-30z"
          className="a"
        ></path>
        <path d="M185 170h85v20h-85zm0 70h55v20h-55z" className="a"></path>
        <path
          d="M210 180h30v64h-30zm30 90h40v60h-40zm190-71h40v131h-40zM120 32h90V0h-90v32M0 0h80v31.88H0zm0 74h80v53.13H0zm120 0v96h30V85h40v85h20V74h-90m270-31V0h-8v74h-92V0h-40v32h30v42h-30v96h20V85h40v85h10v-42h110V85h40V43h-80m200 0h-70V0h-10v85h-40v85h10v-42h120V0h-10v43"
          className="a"
        ></path>
        <path d="M320 21h32v31.88h-32z" className="a"></path>
      </>
    );
  }

  if (mode == 'nomaikura') {
    Path = (
      <>
        <path
          d="M4.3 34c-1.3 0-2.3-.4-3-1.5-1-.7-1.3-1.8-1.3-3.3V27c0-1.3.4-2.4 1.3-3.3 1-1 1.8-1.3 3-1.3h22c.3 0 .5-.3.5-.7v-11c0-2 .5-3.6 1.3-5 1-1.3 2-2 3-2h4.4c1.2 0 2.2.7 3 2 .8 1.4 1.2 3 1.2 5v11c0 .4.3.7.7.7h18.4c1.2 0 2.2.4 3 1.4.8 1 1.2 2.2 1.2 3.3v2.3c0 1.5-.6 2.6-1.5 3.4-.8 1-1.8 1.5-3 1.5h-18c-.5 0-.7.2-.7.8-.2 20.7-9 33.5-26 38.7-1 .3-2.2.2-3.3-.4-1-.7-1.7-1.7-2-3l-1-2.5c-.3-1-.2-2.2.4-3.3.4-1 1.2-2 2.3-2.5 5.6-2 9.8-5.2 12.5-9.5 2.6-4.5 4-10 4-17.4 0-.2 0-.6-.5-.6zM124 16.5c1 1 2 1.5 3.3 1.5 1.3 0 2.5-.6 3.5-1.7.8-1 1.3-2.2 1.3-3.8 0-1.6-.4-3-1.4-4-1-1-2-1.5-3.4-1.5s-2.5.5-3.5 1.5-1.5 2.3-1.5 4c0 1.2.5 2.6 1.4 3.6zm-4.7-12.7c2.2-2.6 5-4 8-4s5.8 1.2 8 4c2.2 2 3.3 5 3.3 8.5 0 2.4-.6 4.7-1.8 6.6-1.3 2.2-3 3.8-4.8 4.8-.3.2-.5.5-.5 1v.5c0 1.2-.3 2.3-1 3-.8.8-1.7 1-2.7 1h-19.2c-.4 0-.7.4-.7 1v35.8c0 1.5-.4 2.8-.7 4-.4 1.2-.8 2-1.4 2.8-.6.5-1.4 1-2.6 1.4-1 .5-2.4.7-3.6.8h-5.4c-1.8 0-3.7 0-5.8-.2-1.2 0-2.2-.7-3-1.8-.7-1-1-2.2-1-3.3v-2.2c.2-1.5.6-2.5 1.5-3.3 1-.8 2-1 3-1l3.7.2c1.2 0 2-.3 2.2-.7.2-.3.3-1.3.3-3V30c0-.6-.2-.8-.6-.8H74.5c-1.2 0-2.2-.3-3-1.3-1-1-1.3-2.2-1.3-3.3v-1.8c0-1 .5-2.4 1.3-3.3 1-1 2-1.4 3-1.4H95c.4 0 .6-.4.6-.8v-7c0-1.4.4-2.5 1.3-3.4.6-1 1.6-1.5 3-1.5h4c1 0 2 .5 3 1.5.6 1 1 2 1 3.3v7c0 .7.3 1 .7 1h7.7c.2 0 .3 0 .4-.3v-.3c-.6-1.8-1-3.3-1-5 0-3.4 1.2-6.5 3.4-8.7zm-48 59.7c-1-.4-1.8-1.3-2.2-2.4-.4-1-.3-2.5 0-3.7 2.4-5.2 4.8-11.5 7.5-19 .5-1 1.2-2.2 2.3-2.7 1-.6 2-.7 3.3-.3l2.7 1c1 .2 1.8 1 2.3 2 .5 1.4.5 2.7 0 4-1.8 5-4.3 11.8-7.6 20-.5 1.2-1.3 2-2.4 2.5-1 .5-2.2.5-3.4-.2zm56.4 1.4c-1 .5-2.2.5-3.3 0-1-.5-1.8-1.4-2.2-2.5l-7.5-20c-.4-1-.4-2.3 0-3.6.4-1 1.2-2.2 2.3-2.5l2.7-1c1-.4 2.2-.4 3.3 0 1 .6 1.8 1.4 2.4 2.7 2.4 6 5 12.6 7.5 19.8.2 1 .2 2.2-.3 3.5-.5 1-1.3 2-2.4 2.4zm21-43c-1 0-2-.4-3-1.4-.8-.8-1.2-2-1.2-3v-2.6c0-1 .4-2.2 1.3-3.3.7-1 1.7-1.3 3-1.3h51.5c1.2 0 2.2.4 3 1.3 1 1 1.3 2.2 1.3 3.3V22c-1.3 4-3.2 8-5.8 12.2-2.7 4-5.7 7.7-9 11-1 1-2 1.2-3.2 1.2-1.2 0-2.2-.7-3-1.7L181 42c-.7-1-1-2.3-1-3.4.3-1.3.7-2.4 1.6-3.3 4-4 7-8 9.3-12.6v-.4s0-.3-.3-.3zm17.8 6.5h3.6c1.3 0 2.3.6 3 1.5 1 1 1.3 2 1.3 3.3-.2 7.3-1 13.4-2 17.8-1.2 4.8-3 8.8-5.3 11.8-2.3 3.4-5.5 6-9.6 8.7-1 .7-2.2 1-3.4.6-1.2-.4-2-1.2-2.8-2.3l-1.7-2.6c-.6-1-.7-2.2-.4-3.5.4-1 1-2.2 2-2.7 4-2.8 7-6 8.6-10 1.5-4 2.4-9.7 2.6-17.7.2-1 .6-2 1.5-3.2.8-.8 2-1 3-1zm101.8-9c1.2.4 2 1 2.6 2.4.5 1 .7 2.2.4 3.7-3.4 13.8-9.4 24.8-17.6 32.3-8.4 7.7-19.7 12.3-34 14.3-1.2 0-2.2-.2-3.2-1-1-.7-1.5-1.8-1.6-3.2l-.5-3.3c0-1 .2-2.4 1-3.3.6-1 1.6-1.7 2.7-2C230 57.6 239 54 245.5 48S257 33 260 21.5c.4-1 1-2.2 2-2.8 1-.6 2.2-.8 3.3-.4zM216 21.8c-1-.7-1.6-1.5-2-3-.2-1 0-2.3.6-3.4l1.6-2.7c.6-1 1.5-1.8 2.7-2.2 1-.3 2 0 3 .6 4.7 3 9.6 6.4 14.7 10 1 1 1.5 2 1.7 3.4.2 1 0 2.2-.7 3.3l-1.6 2.7c-.6 1-1.5 1.8-2.7 2-1.2.3-2.2 0-3.2-.6-4.2-3.3-9-6.7-14-10z"
          fontSize="90"
          fontFamily="Rounded Mgen+ 2pp heavy"
        />
        <path
          d="M303.6 32.8c-4 1-7 3-9.3 6-2.2 3-3.4 6.7-3.4 11 0 2.4.2 4.6 1 6.5 1 1.6 1.7 2.5 2.6 2.5 1 0 2-.8 3-2.3 1-1.4 2-4.2 3.2-8 1-4 2-9 3-15.2V33h-.4zm-9 36.5c-3.4 0-6.4-2-9-5.6-2.7-3.6-4-8-4-13.2 0-8.3 2.5-15 7.6-20.2 5-5 12-7.7 20.5-7.7 7 0 13 2.2 17.4 6.8 4.7 4.5 7 10.3 7 17.4 0 6-1.5 11.3-4.3 15.5-2.8 4.4-6.8 7.4-12 9.3-1 .3-2 .2-2.7-.3-1-.4-1.6-1-2-2.3l-.5-1.8c-.3-1-.2-2 .2-3 .4-.8 1-1.5 2-2 6.3-3 9.4-8 9.4-15.4 0-3.6-.6-6.6-2.4-9-1.8-2.5-4.2-4.3-7-5-.4 0-.6 0-.7.3-3.5 24.2-10 36-19.5 36z"
          fontSize="72"
        />
        <path
          d="M348 22.4c-1 0-2-.5-3-1.5s-1.3-2-1.3-3.4v-2.2c0-1.3.4-2.4 1.3-3.3.8-1 2-1.4 3-1.4h52.5c1 0 2.2.5 3 1.5 1 1 1.3 2 1.3 3.4v6.3c0 .6 0 1-.3 1.3-5 11.5-14 21.6-27 30-.3.3-.4.7 0 1l5.5 9.5c.6 1 .8 2.2.5 3.3-.2 1.4-1 2.2-2 3l-2.3 1.8c-1 .7-2 1-3.2.7-1.2-.5-2-1.2-2.7-2.3-5.3-9-11-17.7-16.6-25.7-.7-1-1-2.2-1-3.3.2-1.4.8-2.3 1.8-3l2.2-2.2c1-.7 2-1 3.3-.8 1.2 0 2.2.6 3 1.7l2 3 1.8 2.5c.2.3.5.3.8.2 9.5-6.6 16-13 19.8-20v.2l-.4-.2zm62 26l-1-3c0-1 0-2.3.7-3.5.7-1.2 1.6-2 2.8-2.3 17.6-5.2 32.8-16 45.6-29.8 1-1 2-1.5 3.3-1.6 1.2 0 2.2.5 3 1.5l2.4 2.5c.8 1 1.2 2.2 1.3 3.3 0 1.6-.5 2.7-1.4 3.6-5.2 5.5-11 10.5-17.8 15-.4.2-.6.6-.5 1v33.3c0 1.5-.4 2.6-1.2 3.3-.7 1-1.7 1.6-3 1.6h-4c-1 0-2-.5-3-1.5-.6-1-1-2-1-3.2V42.5s0-.2-.3-.2h-.4c-7 3.3-13.7 8.2-20.3 10-1.3.2-2.4 0-3.3-.7-1-.8-1.6-1.8-2-3zm68.7-3.2l-1.6-1.8c-.7-.8-1.2-2-1.2-3 0-1.4.3-2.7 1-3.7 6.2-8 10.2-16.5 12.2-26.3.2-1 .8-2.2 1.8-3 1-1 2-1.2 3.3-1.2h3c1.4.2 2.4.8 3 1.7 1 1 1 2 1 3.2 0 .8-.4 1.8-.6 3.3 0 .5 0 .7.4.7H526c1.3 0 2.3.5 3.2 1.4.8 1 1.2 2.2 1.2 3.3v6.6c-1.6 14.4-6 25-12.8 32.4-7 7.2-17.6 12-32 14.7-1.3.2-2.4 0-3.4-1-1-.7-1.5-1.8-1.8-3.2L480 67c-.4-1 0-2.2.5-3.3.7-1 1.6-1.6 2.7-1.8 11-2 19.3-5.7 24.7-11 5.3-5.5 8.6-13.3 10-23.8 0-.5 0-.7-.7-.7H497c-.3 0-.6.2-.8.5-2.5 6-6.3 11.7-11.3 17.7-1 1-2 1.4-3 1.4-1.5 0-2.5-.2-3.4-1zm67-3.8c-1.3 0-2.3-.4-3-1.4-1-1.2-1.4-2.3-1.4-3.4v-2c0-1.3.4-2.5 1.3-3.3.8-1 1.8-1.5 3-1.5h50c1.3 0 2.3.4 3.2 1.4.8 1 1.2 2 1.2 3.3v2c0 3.6-.4 6.6-1.2 9.2-2.7 8.2-7 14.4-13.3 19-6 4.5-14.5 7.6-25.2 9.3-1.2.2-2.3 0-3.3-1-1-.7-1.6-2-1.8-3l-.3-2.3c-.4-1.3 0-2.4.5-3.3.6-1 1.5-1.8 2.7-2 8.5-1.5 15-4 19.7-7.3 4.6-3.2 8-7.6 9.6-13.2 0-.4 0-.6-.4-.6zM552 9h38c1.2 0 2.2.4 3 1.4 1 1 1.3 2 1.3 3.3v2c0 1.2-.4 2.4-1.3 3.2-.7 1-1.7 1.4-3 1.4h-38c-1.2 0-2.3-.5-3-1.5-1-1-1.3-2-1.3-3.4v-2c0-1.2.4-2.3 1.2-3.2.7-1 1.7-1.5 3-1.5z"
          fontSize="90"
          fontFamily="Rounded Mgen+ 2pp heavy"
        />
      </>
    );
  }

  return Path;
};

const Logo = ({ fill = THEME_COLOR, logoSelection }: Props) => {
  const { colorMode } = useColorMode();
  let svgProps = {
    width: 200,
    viewBox: '0 0 565 65',
  };
  if (logoSelection == null || logoSelection == 'dotcom') {
    svgProps.viewBox = '0 0 565 65';
  }
  if (logoSelection == 'nomaikura') {
    svgProps.viewBox = '0 0 600 80';
  }
  if (logoSelection == 'manoikura') {
    svgProps.viewBox = '0 0 640 340';
  }
  return (
    <Box area-label="ロゴ" fontWeight="bold" w="200px">
      <LinkChakra href={'/'}>
        <svg {...svgProps}>
          <g fill={colorMode == 'light' ? fill : 'white'}>
            <PathSelecter mode={logoSelection} />
          </g>
        </svg>
      </LinkChakra>
    </Box>
  );
};

export default Logo;
