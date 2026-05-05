import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import NavbarSub from '../../layouts/NavbarSub';
import '../PageStyles.css';

const { REACT_APP_VERSION } = process.env;

const AboutPage = () => {
  return (
    <>
      <NavbarSub />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-5">
                <h2 className="mb-1 fw-bold">PIPES</h2>
                <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                  Pipeline for Integrated Projects in Energy Systems
                </p>
                <p style={{ fontSize: '1rem' }}>
                  PIPES is a project management, data management, and workflow
                  management layer developed by NLR for integrated modeling
                  teams. It provides a user-friendly interface for pipeline
                  visibility, project coordination, metadata management, and
                  model integration.
                </p>

                <hr className="my-4" />

                <h5 className="mb-3">Version</h5>
                <p className="text-muted">
                  {REACT_APP_VERSION || 'N/A'}
                </p>

                <hr className="my-4" />

                <h5 className="mb-3">Resources</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <a
                      href="https://github.nrel.gov/pipes"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PIPES GitHub Repository
                    </a>
                  </li>
                  <li className="mb-2">
                    <a
                      href="mailto:pipes-support@nrel.gov"
                    >
                      Contact Support
                    </a>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AboutPage;
