
import React, { useState } from 'react';

const Enquiry: React.FC = () => {
  const [formData, setFormData] = useState({
    company: '',
    title: 'Mr.',
    last_name: '',
    first_name: '',
    phone: '',
    email: '',
    skype_id: '',
    country: '',
    description: '',
    verificationCode: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  // 生成隨機驗證碼
  const generateCaptcha = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log('Generated captcha:', code);
    setCaptchaCode(code);
    return code;
  };

  // 組件加載時生成驗證碼
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  // 刷新驗證碼
  const handleRefreshCaptcha = () => {
    generateCaptcha();
    setFormData({ ...formData, verificationCode: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 清理輸入的驗證碼 (移除空格)
    const inputCode = formData.verificationCode.trim();
    const expectedCode = captchaCode.trim();
    
    console.log('Input code:', inputCode);
    console.log('Expected code:', expectedCode);
    console.log('Match:', inputCode === expectedCode);
    
    // 驗證驗證碼
    if (inputCode !== expectedCode) {
      setSubmitError(`驗證碼錯誤，請重新輸入 (輸入: ${inputCode}, 應為: ${expectedCode})`);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            company: formData.company,
            title: formData.title,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            email: formData.email,
            skype_id: formData.skype_id || null,
            country: formData.country,
            description: formData.description,
            submitted_at: new Date().toISOString(),
            status: 'pending'
          }
        })
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        const errorMessage = responseData?.error?.message || '提交失敗，請稍後再試';
        throw new Error(errorMessage);
      }

      setSubmitSuccess(true);
      // 重置表單
      setFormData({
        company: '',
        title: 'Mr.',
        last_name: '',
        first_name: '',
        phone: '',
        email: '',
        skype_id: '',
        country: '',
        description: '',
        verificationCode: ''
      });
      // 重新生成驗證碼
      generateCaptcha();

      // 3秒後隱藏成功訊息
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error instanceof Error ? error.message : '提交失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="enquiry" className="min-h-screen bg-white dark:bg-slate-950 flex items-center border-b-4 border-slate-200 dark:border-slate-700 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-start">
          {/* Left Side - Contact Info */}
          <div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
              CONTACT ENQUIRY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-slate-900 dark:text-white leading-tight">
              Custom Nameplate Design & Production
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-8 md:mb-12">
              Looking for high-quality nameplate solutions tailored to your specifications? We specialize in precision nameplate design and manufacturing. Contact us to discuss your requirements.
            </p>

            {/* Contact Information */}
            <div className="space-y-5 md:space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-white text-2xl">email</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">E-mail</p>
                  <a href="mailto:angela@we-world.com.tw" className="text-slate-900 dark:text-white font-medium hover:text-primary transition-colors">
                    angela@we-world.com.tw
                  </a>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Contact: Angela</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-white text-2xl">phone</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Phone</p>
                  <a href="tel:+886289918085" className="text-slate-900 dark:text-white font-medium hover:text-primary transition-colors">
                    +886-2-8991-8085
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-white text-2xl">print</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Fax</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    +886-2-8991-8095
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company Input */}
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Contact - Title, Last Name, First Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Contact <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
                    required
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last name..."
                    className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    required
                  />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First name..."
                    className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Skype ID and Country - Same Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Skype ID Input */}
                <div>
                  <label htmlFor="skypeId" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Skype ID
                  </label>
                  <input
                    type="text"
                    id="skypeId"
                    name="skype_id"
                    value={formData.skype_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                  />
                </div>

                {/* Country Select */}
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
                    required
                  >
                    <option value="">Choose a Country...</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="China">China</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="USA">USA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description Textarea */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white resize-none"
                  required
                ></textarea>
              </div>

              {/* Verification Code */}
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Verification code <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                    required
                  />
                  <div className="w-32 h-12 bg-[#9FC7DB] rounded-lg flex items-center justify-center text-white font-mono text-lg font-bold tracking-wider select-none">
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    className="px-4 text-[#9FC7DB] hover:text-[#7EA9BD] transition-colors"
                    title="刷新驗證碼"
                  >
                    <span className="material-icons text-3xl">refresh</span>
                  </button>
                </div>
              </div>

              {/* 成功訊息 */}
              {submitSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <span className="material-icons">check_circle</span>
                    <span className="font-semibold">提交成功！我們會盡快與您聯繫。</span>
                  </div>
                </div>
              )}

              {/* 錯誤訊息 */}
              {submitError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <span className="material-icons">error</span>
                    <span className="font-semibold">{submitError}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-hover-blue text-white font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span>{submitting ? '提交中...' : 'Submit Enquiry'}</span>
                <span className="material-icons">{submitting ? 'hourglass_empty' : 'send'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Enquiry;
