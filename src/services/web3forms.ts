export interface Web3FormsPayload {
  access_key?: string;
  subject?: string;
  from_name?: string;
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  budget?: string;
  message?: string;
  [key: string]: any;
}

export interface Web3FormsResult {
  success: boolean;
  message: string;
}

/**
 * Submits form data to Web3Forms API endpoint (https://api.web3forms.com/submit)
 */
export async function submitToWeb3Forms(payload: Web3FormsPayload): Promise<Web3FormsResult> {
  const accessKey = payload.access_key || import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const bodyData = {
    access_key: accessKey,
    subject: payload.subject || 'درخواست جدید از آژانس سیگنالوکس (Signalux Studio)',
    from_name: payload.from_name || 'Signalux Website',
    ...payload,
  };

  if (!accessKey) {
    return { success: false, message: 'سرویس ارسال پیام پیکربندی نشده است.' };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: 'درخواست شما با موفقیت ارسال و در سامانه ثبت شد.',
      };
    } else {
      return {
        success: false,
        message: result.message || 'پاسخی از سرور دریافت نشد.',
      };
    }
  } catch (error) {
    console.error('Error submitting form to Web3Forms:', error);
    return {
      success: false,
      message: 'خطا در ارتباط با سرور ارسال پیام. لطفاً اتصال اینترنت خود را بررسی کنید.',
    };
  }
}
