import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1 style={{ fontSize: '4rem', color: '#ff4d4d', marginBottom: '16px' }}>404</h1>
        <h2>Page Not Found</h2>
        <p style={{ color: '#aaa', margin: '16px 0 24px 0' }}>
          This page isn't available. Sorry about that. Try searching for something else.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#cc0000',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          Go to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
