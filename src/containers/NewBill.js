
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    file.accept = ".png, .jpg, .jpeg"
  }

  handleChangeFile = () => {
    const fileObj = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const fileName = fileObj ? fileObj.name : ""
    /* istanbul ignore next */
    this.firestore
      .storage
      .ref(`justificatifs/${fileName}`)
      .put(fileObj)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        // restrict file extension
        if (fileObj.type === "image/png" || fileObj.type === "image/jpg" || fileObj.type === "image/jpeg") {
          this.fileUrl = url
          this.fileName = fileName
        }else{
          this.fileUrl = "none"
          this.fileName = "none"
        }
      })
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.fileUrl === "none" ||
        this.fileName === "none") {
      return
    }
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}