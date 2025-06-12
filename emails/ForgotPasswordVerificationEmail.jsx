import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

export default function ForgotPasswordEmailVerification({
  username,
  verifyCode, // 6-digit code you generate server-side
}) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>MoneyMate – Password Reset</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      {/* ✨ in-inbox preview line */}
      <Preview>
        Your MoneyMate password-reset code: {verifyCode}
      </Preview>

      <Section
        style={{
          backgroundColor: '#f8fafc',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
          }}
        >
          {/* ── Header ────────────────────────── */}
          <div
            style={{
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              padding: '40px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'white',
                borderRadius: '12px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                  borderRadius: '4px',
                }}
              ></div>
            </div>
            <Heading
              style={{
                color: 'white',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0',
              }}
            >
              MoneyMate
            </Heading>
          </div>

          {/* ── Content ───────────────────────── */}
          <div style={{ padding: '40px 20px' }}>
            <Row>
              <Heading
                as="h2"
                style={{
                  color: '#1f2937',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                Hi {username || 'there'},
              </Heading>
            </Row>

            <Row>
              <Text
                style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  marginBottom: '24px',
                }}
              >
                You recently requested to reset your MoneyMate password. Use the
                verification code below to continue:
              </Text>
            </Row>

            {/* Verification Code */}
            <Row>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#3b82f6',
                  backgroundColor: '#f1f5f9',
                  padding: '24px',
                  borderRadius: '12px',
                  letterSpacing: '8px',
                  fontFamily: 'monospace',
                  border: '2px dashed #3b82f6',
                  margin: '24px 0',
                }}
              >
                {verifyCode}
              </div>
            </Row>

            <Row>
              <Text
                style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  marginBottom: '16px',
                }}
              >
                This code will expire in <strong>10 minutes</strong>. If you
                didn’t request a password reset, please ignore this email or
                contact our support team.
              </Text>
            </Row>

            {/* Security Notice */}
            <div
              style={{
                backgroundColor: '#fef3c7',
                borderLeft: '4px solid #f59e0b',
                padding: '16px',
                borderRadius: '6px',
                marginTop: '24px',
              }}
            >
              <Text
                style={{
                  color: '#92400e',
                  fontSize: '14px',
                  margin: '0',
                  fontWeight: '500',
                }}
              >
                🔒 Security Notice: Never share this code with anyone. MoneyMate
                will never ask for your verification code via phone or email.
              </Text>
            </div>
          </div>

          {/* ── Footer ────────────────────────── */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              padding: '24px 20px',
              textAlign: 'center',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <Text
              style={{
                color: '#6b7280',
                fontSize: '14px',
                margin: '0 0 8px',
              }}
            >
              Stay safe,<br />
              The MoneyMate Team
            </Text>
            <Text
              style={{
                color: '#9ca3af',
                fontSize: '12px',
                margin: '0',
              }}
            >
              © 2024 MoneyMate. All rights reserved.
            </Text>
          </div>
        </div>
      </Section>
    </Html>
  );
}
