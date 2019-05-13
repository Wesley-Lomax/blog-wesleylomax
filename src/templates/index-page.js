import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'
import BlogRoll from '../components/BlogRoll'

export const IndexPageTemplate = ({
  image,
  title,
}) => (
  <div>
    <div
      className="full-width-image margin-top-0"
      style={{
        backgroundImage: `url(${
          !!image.childImageSharp ? image.childImageSharp.fluid.src : image
        })`,
        backgroundPosition: `top left`,
        backgroundAttachment: `fixed`,
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '150px',
          lineHeight: '1',
          justifyContent: 'space-around',
          alignItems: 'left',
          flexDirection: 'column',
        }}
      >
        <h1
          className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
          style={{
            boxShadow:
              'rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px',
            backgroundColor: 'rgb(255, 68, 0)',
            color: 'white',
            lineHeight: '1',
            padding: '0.25em',
          }}
        >
          {title}
        </h1>        
      </div>
    </div>
    <section className="section section--gradient">
      <div className="container">
        <div className="section">
          <div className="columns">
            <div className="column is-12">
              <div className="content">                
              <div className="content">                  
                </div>
                <div className="columns">
                  <div className="column is-12">
                  </div>
                </div>
                <div className="column is-12">
                  <h3 className="has-text-weight-semibold is-size-2">
                    Latest posts
                  </h3>
                  <BlogRoll />
                  <div className="column is-12 has-text-centered">
                    <Link className="btn" to="/posts">
                      Read more
                    </Link>
                  </div>
                </div>
                <div>
                <div class="column is-12">
                  <h1 class="widget-title">Awards</h1>			
                    <div class="awards">
                      <a href="//mvp.sitecore.net/" target="_blank" title="Wesley Lomax Sitecore MVP Technology 2018" rel="noopener noreferrer">
                        <img src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2018/01/Sitecore_MVP_logo_Technology_2018.jpg?w=170&amp;ssl=1" alt="Sitecore Technology MVP 2017" width="170" height="166"/>
                      </a>
                      <a href="//www.sitecore.net/mvp" target="_blank" title="Wesley Lomax Sitecore MVP Technology 2017" rel="noopener noreferrer">
                        <img src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2017/02/Sitecore_MVP_logo_Technology_2017.png?w=170" alt="Sitecore Technology MVP 2017" width="170" height="166"/>
                      </a>
                      <a href="//mvp.sitecore.net/" target="_blank" title="Wesley Lomax Sitecore MVP Technology 2016" rel="noopener noreferrer">
                        <img src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/09/MVP-2016-Technology-logo.png?w=640&amp;ssl=1" alt="Sitecore Technology MVP 2016" width="170" height="167"/>
                      </a>
                      <a href="//mvp.sitecore.net/" target="_blank" title="Wesley Lomax Sitecore MVP" rel="noopener noreferrer">
                        <img src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/09/MVP-2016-General-logo.png?w=640&amp;ssl=1" alt="Sitecore MVP" width="170" height="167"/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
)

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string
}

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark

  return (
    <Layout>
      <IndexPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}        
      />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
