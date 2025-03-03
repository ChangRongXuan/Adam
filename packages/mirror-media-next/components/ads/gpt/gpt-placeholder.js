import styled from 'styled-components'

/**
 * @typedef {string} Width
 * @typedef {string} Height
 * @typedef {string} Margin
 *
 *
 * @typedef {Object} Rwd
 * @property {{width: Width, height: Height, margin: Margin}} rwd.mobile
 * @property {{width: Width, height: Height, margin: Margin}} rwd.tablet
 * @property {{width: Width, height: Height, margin: Margin}} rwd.desktop
 */

const Container = styled.div`
  min-width: ${
    /** @param {{rwd: Rwd}} props*/
    ({ rwd }) => rwd.mobile.width
  };
  min-height: ${({ rwd }) => rwd.mobile.height};
  margin: ${({ rwd }) => rwd.mobile.margin};
  ${({ theme }) => theme.breakpoint.md} {
    min-width: ${
      /** @param {{rwd: Rwd}} props*/
      ({ rwd }) => rwd.tablet.width
    };
    min-height: ${({ rwd }) => rwd.tablet.height};
    margin: ${({ rwd }) => rwd.tablet.margin};
  }

  ${({ theme }) => theme.breakpoint.xl} {
    min-width: ${({ rwd }) => rwd.desktop.width};
    min-height: ${({ rwd }) => rwd.desktop.height};
    margin: ${({ rwd }) => rwd.desktop.margin};
  }
`
const ContainerMobileAndTablet = styled(Container)`
  display: block;
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
const ContainerDesktop = styled(Container)`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
  }
`

const DEFAULT_SIZES = {
  mobile: {
    width: '300px',
    height: '250px',
    margin: '20px auto 0px',
  },
  tablet: {
    width: '300px',
    height: '250px',
    margin: '20px auto 0px',
  },
  desktop: {
    width: '970px',
    height: '250px',
    margin: '20px auto 0px',
  },
}

/**
 *
 * @param {Object} props
 * @param {Rwd} [props.rwd]
 * @param {JSX.Element} props.children
 * @returns {JSX.Element}
 */
export default function GPT_Placeholder({ rwd = DEFAULT_SIZES, children }) {
  return <Container rwd={rwd}>{children}</Container>
}
/**
 *
 * @param {Object} props
 * @param {Rwd} [props.rwd]
 * @param {JSX.Element} props.children
 * @returns
 */
const GPT_Placeholder_MobileAndTablet = ({ rwd = DEFAULT_SIZES, children }) => {
  return (
    <ContainerMobileAndTablet rwd={rwd}>{children}</ContainerMobileAndTablet>
  )
}
const GPT_Placeholder_Desktop = ({ rwd = DEFAULT_SIZES, children }) => {
  return <ContainerDesktop rwd={rwd}>{children}</ContainerDesktop>
}

export { GPT_Placeholder_MobileAndTablet, GPT_Placeholder_Desktop }
