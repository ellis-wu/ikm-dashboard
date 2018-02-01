import { createTest, destroyVM } from '../util'
import Dashboard from '@/views/dashboard'

describe('dashboard.vue', () => {
  let vm

  beforeEach(() => {
    vm = createTest(Dashboard)
  })

  afterEach(() => {
    destroyVM(vm)
  })

  it('should render correct contents', () => {
    var text = vm.$el.querySelector('.dashboard-container h1').textContent
    expect(text).to.equal('Dashboard')
  })
})
