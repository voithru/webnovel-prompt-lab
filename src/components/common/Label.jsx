import React from 'react'
import clsx from 'clsx'
import styles from '../../styles/modules/Label.module.css'

const Label = ({
  children,
  htmlFor,
  required = false,
  optional = false,
  size = 'medium',
  className,
  ...props
}) => {
  const labelClasses = clsx(
    styles.label,
    styles[size],
    {
      [styles.required]: required,
      [styles.optional]: optional
    },
    className
  )

  return (
    <label 
      className={labelClasses}
      htmlFor={htmlFor}
      {...props}
    >
      <span className={styles.text}>{children}</span>
      {required && <span className={styles.requiredMark}>*</span>}
      {optional && <span className={styles.optionalMark}>(선택)</span>}
    </label>
  )
}

export default Label
