import { useState } from "react";

const initialFormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  message: "",
};

export const ContactUsFormSection = () => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmissionMessage("Your message has been sent.");
    setFormValues(initialFormValues);
  };

  const fieldClassName =
    "relative w-full h-[41px] px-3 py-2.5 bg-[#f0ede6] rounded-lg overflow-hidden border-[0.67px] border-solid border-[#1e3d251f] text-[#1a1a1a] placeholder:text-[#1a1a1a80] text-[13px] leading-[normal] [font-family:'Lato',Helvetica] font-normal tracking-[0] focus:border-[#1e3d25]";

  return (
    <section
      className="px-5 py-7 self-stretch w-full flex-[0_0_auto] bg-white flex flex-col items-start relative"
      aria-labelledby="contact-us-heading"
    >
      <div className="flex flex-col items-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
        <h2
          id="contact-us-heading"
          className="relative w-fit mt-[-1.00px] [font-family:'Playfair_Display',Helvetica] font-semibold text-[#1e3d25] text-xl tracking-[0.50px] leading-7 whitespace-nowrap"
        >
          Contact Us
        </h2>
        <img
          className="relative flex-[0_0_auto]"
          alt=""
          aria-hidden="true"
          src="/img/container-11.svg"
        />
      </div>
      <form
        className="flex flex-col w-[344px] items-start gap-3 pt-6 pb-0 px-0 relative flex-[0_0_auto]"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-[166px_166px] grid-rows-[40.83px] h-[41px] gap-3">
          <div className="relative row-[1_/_2] col-[1_/_2] justify-self-start w-[166px] h-full">
            <label className="sr-only" htmlFor="contact-first-name">
              First name
            </label>
            <input
              id="contact-first-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              value={formValues.firstName}
              onChange={handleChange}
              required
              className={fieldClassName}
            />
          </div>
          <div className="relative row-[1_/_2] col-[2_/_3] justify-self-start w-[166px] h-full">
            <label className="sr-only" htmlFor="contact-last-name">
              Last name
            </label>
            <input
              id="contact-last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              value={formValues.lastName}
              onChange={handleChange}
              required
              className={fieldClassName}
            />
          </div>
        </div>
        <label className="sr-only" htmlFor="contact-phone">
          Phone number
        </label>
        <input
          id="contact-phone"
          name="phone"
          className={fieldClassName}
          placeholder="Phone number"
          type="tel"
          autoComplete="tel"
          value={formValues.phone}
          onChange={handleChange}
          required
        />
        <label className="sr-only" htmlFor="contact-email">
          Email address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          value={formValues.email}
          onChange={handleChange}
          required
          className={fieldClassName}
        />
        <label className="sr-only" htmlFor="contact-message">
          Your message
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Your message..."
          value={formValues.message}
          onChange={handleChange}
          required
          className="flex flex-col w-[344px] h-[90px] items-start px-3 py-2.5 relative bg-[#f0ede6] rounded-lg overflow-hidden border-[0.67px] border-solid border-[#1e3d251f] resize-none text-[#1a1a1a] placeholder:text-[#1a1a1a80] text-[13px] tracking-[0] leading-[19.5px] [font-family:'Lato',Helvetica] font-normal focus:border-[#1e3d25]"
        />
        <button
          className="all-unset box-border gap-2 px-0 py-3 self-stretch w-full bg-[#1e3d25] flex items-center justify-center relative flex-[0_0_auto] rounded-xl cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e3d25]"
          type="submit"
        >
          <img
            className="relative w-3.5 h-3.5"
            alt=""
            aria-hidden="true"
            src="/img/icon-7.svg"
          />
          <span className="relative w-fit mt-[-1.00px] [font-family:'Lato',Helvetica] font-semibold text-[#f5f4f0] text-sm text-center tracking-[0] leading-[21px] whitespace-nowrap">
            Send Message
          </span>
        </button>
        <p className="sr-only" role="status" aria-live="polite">
          {submissionMessage}
        </p>
      </form>
    </section>
  );
};
