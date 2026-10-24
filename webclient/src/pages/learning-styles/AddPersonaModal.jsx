import { useState, useEffect } from 'react';

function AddPersonaModal({ show, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '', // User name
        q1: '', // Multiple choice
        q2: '', // Radio (2 options)
        q3: '', // Radio (2 options)
        q3Explanation: '', // Text explanation for q3
        q4: '', // Free text
        q5: '', // Multiple choice
        q5Explanation: '', // Text explanation for q5
        q6: '', // Free text
        q7: '' // Long descriptive text
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (show) {
            // Reset form when modal opens
            setFormData({
                name: '',
                q1: '',
                q2: '',
                q3: '',
                q3Explanation: '',
                q4: '',
                q5: '',
                q5Explanation: '',
                q6: '',
                q7: ''
            });
            setErrors({});
        }
    }, [show]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'لطفاً نام یادگیرنده را وارد کنید';
        if (!formData.q1) newErrors.q1 = 'لطفاً یک گزینه انتخاب کنید';
        if (!formData.q2) newErrors.q2 = 'لطفاً یک گزینه انتخاب کنید';
        if (!formData.q3) newErrors.q3 = 'لطفاً یک گزینه انتخاب کنید';
        if (!formData.q3Explanation.trim()) newErrors.q3Explanation = 'لطفاً توضیح خود را وارد کنید';
        if (!formData.q4.trim()) newErrors.q4 = 'لطفاً پاسخ خود را وارد کنید';
        if (!formData.q5) newErrors.q5 = 'لطفاً یک گزینه انتخاب کنید';
        if (!formData.q5Explanation.trim()) newErrors.q5Explanation = 'لطفاً توضیح خود را وارد کنید';
        if (!formData.q6.trim()) newErrors.q6 = 'لطفاً پاسخ خود را وارد کنید';
        if (!formData.q7.trim()) newErrors.q7 = 'لطفاً تجربه خود را شرح دهید';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Prepare JSON payload
        const payload = {
            name: formData.name,
            questionnaire: {
                question1: {
                    question: "وقتی با یک موضوع کاملاً جدید مواجه می‌شوی، اولین کاری که معمولاً انجام می‌دهی چیست؟",
                    answer: formData.q1,
                    type: "multiple_choice"
                },
                question2: {
                    question: "وقتی برای اولین بار یک درس یا مفهوم را می‌خوانی، بیشتر: قبل از انجام هر کاری، چند لحظه مکث می‌کنی تا در ذهنت آن را تحلیل کنی، یا با انجام‌دادن، ساختن، یا تمرین‌کردن سریع‌تر یاد می‌گیری؟",
                    answer: formData.q2,
                    type: "choice"
                },
                question3: {
                    question: "برای درک یک موضوع پیچیده، کدام روش راحت‌تر است؟",
                    answer: formData.q3,
                    explanation: formData.q3Explanation,
                    type: "choice_with_explanation"
                },
                question4: {
                    question: "وقتی در یک کارگاه، جلسه آموزشی یا کلاس شرکت می‌کنی، معمولاً چه می‌کنی؟",
                    answer: formData.q4,
                    type: "free_text"
                },
                question5: {
                    question: "اگر قرار باشد یک ابزار، نرم‌افزار یا دستگاه جدید یاد بگیری",
                    answer: formData.q5,
                    explanation: formData.q5Explanation,
                    type: "multiple_choice_with_explanation"
                },
                question6: {
                    question: "در یک درس، بیشتر چه چیزی توجهت را جلب می‌کند؟",
                    answer: formData.q6,
                    type: "free_text"
                },
                question7: {
                    question: "یک تجربه‌ای را شرح بده که در آن خیلی سریع و عمیق یک موضوع را یاد گرفتی.",
                    answer: formData.q7,
                    type: "descriptive"
                }
            }
        };

        try {
            // Send to dummy API endpoint
            const response = await fetch('http://localhost:8080/learning-styles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response from API:', data);
            
            // Create new persona from API response
            // Assuming API returns: { name, description, varkStyle, honeyMumfordStyle, fslsStyles }
            const newPersona = {
                name: data.name || formData.name,
                description: data.description || 'یادگیرنده جدید',
                varkStyle: data.varkStyle || { visual: 0, auditory: 0, reading: 0, kinesthetic: 0 },
                honeyMumfordStyle: data.honeyMumfordStyle || { activist: 0, reflector: 0, theorist: 0, pragmatist: 0 },
                fslsStyles: data.fslsStyles || { active: 0, reflective: 0, sensing: 0, intuitive: 0, visual: 0, verbal: 0, sequential: 0, global: 0 }
            };
            
            // Call onSave to add persona to list
            if (onSave) {
                onSave(newPersona);
            }
            
            // Show success message
            alert('پرسشنامه با موفقیت ارسال شد و یادگیرنده جدید اضافه شد!');
            
            // Close modal
            onClose();
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
            alert('خطا در ارسال پرسشنامه. لطفاً دوباره تلاش کنید.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            q1: '',
            q2: '',
            q3: '',
            q3Explanation: '',
            q4: '',
            q5: '',
            q5Explanation: '',
            q6: '',
            q7: ''
        });
        setErrors({});
        onClose();
    };

    if (!show) return null;

    return (
        <div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-lg modal-dialog-scrollable" style={{ direction: 'rtl', maxWidth: '900px', maxHeight: '90vh', margin: '1.75rem auto' }}>
                <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                    <div className="modal-header justify-content-between" style={{ flexShrink: 0 }}>
                        <h5 className="modal-title fw-bold">افزودن یادگیرنده جدید - پرسشنامه سبک یادگیری</h5>
                        <button 
                            type="button" 
                            className="btn-close p-0 m-0" 
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                        <div className="modal-body" style={{ direction: 'rtl', textAlign: 'right', overflowY: 'auto', flex: 1 }}>
                            
                            {/* Name Field */}
                            <div className="mb-4 p-3 border rounded" style={{ borderWidth: '2px', borderColor: '#000' }}>
                                <h6 className="fw-bold mb-3">نام یادگیرنده</h6>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="نام یادگیرنده را وارد کنید"
                                    style={{ borderWidth: '2px', borderColor: errors.name ? '#dc3545' : '#000' }}
                                />
                                {errors.name && <div className="text-danger small mt-2">{errors.name}</div>}
                            </div>

                            {/* Question 1 */}
                            <div className="mb-4 p-3 border rounded" style={{ borderWidth: '2px', borderColor: '#000' }}>
                                <h6 className="fw-bold mb-3">۱) سؤال موقعیتی – چندگزینه‌ای</h6>
                                <p className="mb-3">وقتی با یک موضوع کاملاً جدید مواجه می‌شوی، اولین کاری که معمولاً انجام می‌دهی چیست؟</p>
                                <div className="form-check mb-2 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q1" 
                                        id="q1a" 
                                        value="visual"
                                        checked={formData.q1 === 'visual'}
                                        onChange={(e) => handleChange('q1', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q1a">
                                        الف) یک تصویر، دیاگرام، نقشه مفهومی یا ویدئو پیدا می‌کنم (V-Visual / F-Visual)
                                    </label>
                                </div>
                                <div className="form-check mb-2 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q1" 
                                        id="q1b" 
                                        value="auditory"
                                        checked={formData.q1 === 'auditory'}
                                        onChange={(e) => handleChange('q1', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q1b">
                                        ب) توضیح کسی را گوش می‌دهم یا با کسی درباره‌اش حرف می‌زنم (A-Auditory / F-Verbal)
                                    </label>
                                </div>
                                <div className="form-check mb-2 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q1" 
                                        id="q1c" 
                                        value="reading"
                                        checked={formData.q1 === 'reading'}
                                        onChange={(e) => handleChange('q1', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q1c">
                                        ج) متن، جزوه یا مقاله می‌خوانم و یادداشت‌برداری می‌کنم (R-Read/Write)
                                    </label>
                                </div>
                                <div className="form-check p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q1" 
                                        id="q1d" 
                                        value="kinesthetic"
                                        checked={formData.q1 === 'kinesthetic'}
                                        onChange={(e) => handleChange('q1', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q1d">
                                        د) سعی می‌کنم یک مثال عملی یا تجربه واقعی انجام دهم (K-Kinesthetic / H-Activist / F-Sensing)
                                    </label>
                                </div>
                                {errors.q1 && <div className="text-danger small mt-2">{errors.q1}</div>}
                            </div>

                            {/* Question 2 */}
                            <div className="mb-4 p-3 border rounded" style={{ borderWidth: '2px', borderColor: '#000' }}>
                                <h6 className="fw-bold mb-3">۲) سؤال پردازش اطلاعات – کوتاه</h6>
                                <p className="mb-3">وقتی برای اولین بار یک درس یا مفهوم را می‌خوانی، بیشتر:</p>
                                <div className="form-check mb-2 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q2" 
                                        id="q2a" 
                                        value="reflective"
                                        checked={formData.q2 === 'reflective'}
                                        onChange={(e) => handleChange('q2', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q2a">
                                        قبل از انجام هر کاری، چند لحظه مکث می‌کنم تا در ذهنم آن را تحلیل کنم
                                    </label>
                                </div>
                                <div className="form-check p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q2" 
                                        id="q2b" 
                                        value="active"
                                        checked={formData.q2 === 'active'}
                                        onChange={(e) => handleChange('q2', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q2b">
                                        با انجام‌دادن، ساختن، یا تمرین‌کردن سریع‌تر یاد می‌گیرم
                                    </label>
                                </div>
                                {errors.q2 && <div className="text-danger small mt-2">{errors.q2}</div>}
                            </div>

                            {/* Question 3 */}
                            <div className="mb-4 p-3 border rounded" style={{ borderWidth: '2px', borderColor: '#000' }}>
                                <h6 className="fw-bold mb-3">۳) سؤال مدل فهم – چندگزینه‌ای + تشریحی</h6>
                                <p className="mb-3">برای درک یک موضوع پیچیده، کدام روش راحت‌تر است؟</p>
                                <div className="form-check mb-2 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q3" 
                                        id="q3a" 
                                        value="sequential"
                                        checked={formData.q3 === 'sequential'}
                                        onChange={(e) => handleChange('q3', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q3a">
                                        الف) توضیح مرحله‌به‌مرحله و خطی (Sequential)
                                    </label>
                                </div>
                                <div className="form-check mb-3 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q3" 
                                        id="q3b" 
                                        value="global"
                                        checked={formData.q3 === 'global'}
                                        onChange={(e) => handleChange('q3', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q3b">
                                        ب) داشتن یک تصویر کلی قبل از جزئیات (Global)
                                    </label>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="q3Explanation" className="form-label">توضیح بده چرا این روش برایت بهتر است:</label>
                                    <textarea
                                        className={`form-control ${errors.q3Explanation ? 'is-invalid' : ''}`}
                                        id="q3Explanation"
                                        rows="3"
                                        value={formData.q3Explanation}
                                        onChange={(e) => handleChange('q3Explanation', e.target.value)}
                                        placeholder="توضیح خود را وارد کنید..."
                                        style={{ borderWidth: '2px', borderColor: errors.q3Explanation ? '#dc3545' : '#000' }}
                                    />
                                    {errors.q3Explanation && <div className="text-danger small mt-1">{errors.q3Explanation}</div>}
                                </div>
                                {errors.q3 && <div className="text-danger small mt-2">{errors.q3}</div>}
                            </div>

                            {/* Question 4 */}
                            <div className="mb-4 p-3 border rounded" style={{ borderWidth: '2px', borderColor: '#000' }}>
                                <h6 className="fw-bold mb-3">۴) سؤال رفتار یادگیری – کوتاه</h6>
                                <p className="mb-3">وقتی در یک کارگاه، جلسه آموزشی یا کلاس شرکت می‌کنی، معمولاً چه می‌کنی؟</p>
                                <p className="small text-muted mb-2">(رسم شکل، ضبط صدا، پرسیدن سؤال مفهومی، دست‌به‌کار شدن، مشاهده‌کردن، تحلیل‌های منطقی و…)</p>
                                <textarea
                                    className={`form-control ${errors.q4 ? 'is-invalid' : ''}`}
                                    rows="4"
                                    value={formData.q4}
                                    onChange={(e) => handleChange('q4', e.target.value)}
                                    placeholder="پاسخ خود را وارد کنید..."
                                    style={{ borderWidth: '2px', borderColor: errors.q4 ? '#dc3545' : '#000' }}
                                />
                                {errors.q4 && <div className="text-danger small mt-2">{errors.q4}</div>}
                            </div>

                            {/* Question 5 */}
                            <div className="mb-4 p-3 border rounded" style={{ borderWidth: '2px', borderColor: '#000' }}>
                                <h6 className="fw-bold mb-3">۵) سؤال تجربه عملی – چندگزینه‌ای + کوتاه</h6>
                                <p className="mb-3">اگر قرار باشد یک ابزار، نرم‌افزار یا دستگاه جدید یاد بگیری:</p>
                                <div className="form-check mb-2 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q5" 
                                        id="q5a" 
                                        value="kinesthetic"
                                        checked={formData.q5 === 'kinesthetic'}
                                        onChange={(e) => handleChange('q5', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q5a">
                                        الف) با آزمون‌وخطا شروع می‌کنم (Kinesthetic / Activist / Active / Sensing)
                                    </label>
                                </div>
                                <div className="form-check mb-2 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q5" 
                                        id="q5b" 
                                        value="visual"
                                        checked={formData.q5 === 'visual'}
                                        onChange={(e) => handleChange('q5', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q5b">
                                        ب) اول ویدئو یا تصویر می‌بینم (Visual)
                                    </label>
                                </div>
                                <div className="form-check mb-2 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q5" 
                                        id="q5c" 
                                        value="reading"
                                        checked={formData.q5 === 'reading'}
                                        onChange={(e) => handleChange('q5', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q5c">
                                        ج) دستورالعمل مکتوب یا متن می‌خوانم (Read/Write)
                                    </label>
                                </div>
                                <div className="form-check mb-3 p-2 border rounded" style={{ borderWidth: '1px', borderColor: '#000' }}>
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="q5" 
                                        id="q5d" 
                                        value="auditory"
                                        checked={formData.q5 === 'auditory'}
                                        onChange={(e) => handleChange('q5', e.target.value)}
                                        style={{ borderWidth: '2px', borderColor: '#000' }}
                                    />
                                    <label className="form-check-label" htmlFor="q5d">
                                        د) از کسی می‌پرسم تا توضیح بدهد (Auditory / Verbal)
                                    </label>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="q5Explanation" className="form-label">در یک جمله بگو چرا این گزینه را انتخاب می‌کنی:</label>
                                    <textarea
                                        className={`form-control ${errors.q5Explanation ? 'is-invalid' : ''}`}
                                        id="q5Explanation"
                                        rows="2"
                                        value={formData.q5Explanation}
                                        onChange={(e) => handleChange('q5Explanation', e.target.value)}
                                        placeholder="توضیح خود را وارد کنید..."
                                        style={{ borderWidth: '2px', borderColor: errors.q5Explanation ? '#dc3545' : '#000' }}
                                    />
                                    {errors.q5Explanation && <div className="text-danger small mt-1">{errors.q5Explanation}</div>}
                                </div>
                                {errors.q5 && <div className="text-danger small mt-2">{errors.q5}</div>}
                            </div>

                            {/* Question 6 */}
                            <div className="mb-4 p-3 border rounded" style={{ borderWidth: '2px', borderColor: '#000' }}>
                                <h6 className="fw-bold mb-3">۶) سؤال ترجیح محتوایی – کوتاه</h6>
                                <p className="mb-3">در یک درس، بیشتر چه چیزی توجهت را جلب می‌کند؟</p>
                                <p className="small text-muted mb-2">مثال‌های واقعی و جزئیات؟ (Sensing) | الگوها، مفاهیم کلی و ایده‌های انتزاعی؟ (Intuitive) | تصاویر و نمودارها؟ (Visual) | توضیح کلامی یا نوشتاری؟ (Verbal/Read-Write)</p>
                                <textarea
                                    className={`form-control ${errors.q6 ? 'is-invalid' : ''}`}
                                    rows="4"
                                    value={formData.q6}
                                    onChange={(e) => handleChange('q6', e.target.value)}
                                    placeholder="پاسخ خود را وارد کنید..."
                                    style={{ borderWidth: '2px', borderColor: errors.q6 ? '#dc3545' : '#000' }}
                                />
                                {errors.q6 && <div className="text-danger small mt-2">{errors.q6}</div>}
                            </div>

                            {/* Question 7 */}
                            <div className="mb-4 p-3 border rounded" style={{ borderWidth: '2px', borderColor: '#000' }}>
                                <h6 className="fw-bold mb-3">۷) سؤال تجربیات یادگیری – تشریحی</h6>
                                <p className="mb-3">یک تجربه‌ای را شرح بده که در آن خیلی سریع و عمیق یک موضوع را یاد گرفتی.</p>
                                <p className="small text-muted mb-2">بگو: چگونه شروع کردی؟ (Activist/Reflector – Active/Reflective) | چه نوع اطلاعاتی برایت مفیدتر بود؟ (VARK – Sensory/Intuitive – Verbal/Visual) | چطور موضوع را سازمان‌دهی کردی؟ (Sequential/Global) | به‌دنبال تحلیل نظری بودی یا کاربرد عملی؟ (Theorist/Pragmatist)</p>
                                <textarea
                                    className={`form-control ${errors.q7 ? 'is-invalid' : ''}`}
                                    rows="6"
                                    value={formData.q7}
                                    onChange={(e) => handleChange('q7', e.target.value)}
                                    placeholder="تجربه خود را به تفصیل شرح دهید..."
                                    style={{ borderWidth: '2px', borderColor: errors.q7 ? '#dc3545' : '#000' }}
                                />
                                {errors.q7 && <div className="text-danger small mt-2">{errors.q7}</div>}
                            </div>

                        </div>
                        <div className="modal-footer" style={{ direction: 'rtl', flexShrink: 0 }}>
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                انصراف
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'در حال ارسال...' : 'ارسال پرسشنامه'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPersonaModal;

